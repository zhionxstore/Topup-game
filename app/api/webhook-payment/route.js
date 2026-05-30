import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const body = await request.json();
        const { merchant_ref, status } = body; // Sesuaikan field 'merchant_ref' & 'status' dengan dokumentasi PG Anda

        // Ambil data transaksi dari database berdasarkan ID
        const tx = global.transactionDb[merchant_ref];

        if (status === 'PAID' && tx && tx.status === 'PENDING') {
            // 1. Update status di database agar tidak double process
            tx.status = 'PAID';
            console.log(`[PAID] Dana masuk untuk invoice ${merchant_ref}. Memproses topup...`);

            // 2. Hit API H2H (Orderkuota)
            const okResponse = await axios.post('https://api.orderkuota.com/v1/transaksi', {
                api_key: process.env.ORDERKUOTA_API_KEY,
                pin: process.env.ORDERKUOTA_PIN,
                kode_produk: tx.product_code,
                target: tx.target,
                ref_id: merchant_ref
            });

            if (okResponse.data.status === 'success') {
                console.log(`[SUCCESS] Top up ${tx.product_code} ke ${tx.target} berhasil!`);
                // TODO (Opsional): Panggil API WhatsApp (misal Fonnte/Wablas) untuk kirim struk ke WA pembeli di baris ini
            } else {
                console.error('[FAILED] Orderkuota error:', okResponse.data.message);
            }
        }

        // Harus selalu merespons 200 OK agar Payment Gateway tidak mencoba mengirim ulang notifikasi (spamming)
        return NextResponse.json({ success: true, message: 'Webhook received' }, { status: 200 });

    } catch (error) {
        console.error('API Error Webhook:', error.message);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
