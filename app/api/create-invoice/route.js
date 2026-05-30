import { NextResponse } from 'next/server';
import axios from 'axios';

// CATATAN: Gunakan Database asli (MySQL/Prisma) untuk menyimpan order_id di tahap production.
// Ini hanya simulasi database menggunakan variabel global untuk contoh.
global.transactionDb = global.transactionDb || {};

export async function POST(request) {
    try {
        const body = await request.json();
        const { game, target_id, zone_id, product_code, amount, customer_wa } = body;
        
        // Generate Order ID Unik
        const orderId = 'INV-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const fullTarget = zone_id ? `${target_id}(${zone_id})` : target_id;

        // Contoh: Meminta QRIS ke Payment Gateway (Ganti URL/Format dengan dokumentasi PG Anda spt Tripay/Midtrans)
        const pgResponse = await axios.post('https://tripay.co.id/api/transaction/create', {
            method: 'QRIS',
            merchant_ref: orderId,
            amount: amount,
            customer_name: 'Gamer User',
            customer_phone: customer_wa,
            order_items: [{ name: `${game} - ${product_code}`, price: amount, quantity: 1 }]
        }, {
            headers: { 'Authorization': `Bearer ${process.env.PG_API_KEY}` }
        });

        // Simpan status transaksi ke database
        global.transactionDb[orderId] = {
            target: fullTarget, 
            product_code: product_code, 
            amount: amount, 
            status: 'PENDING'
        };

        // Kembalikan URL QRIS ke frontend
        return NextResponse.json({
            success: true,
            order_id: orderId,
            qris_url: pgResponse.data.data.qr_url 
        });

    } catch (error) {
        console.error('API Error Create Invoice:', error.message);
        return NextResponse.json({ success: false, message: 'Gagal menghubungi Payment Gateway' }, { status: 500 });
    }
}
