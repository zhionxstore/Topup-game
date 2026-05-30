'use client';

import { useState } from 'react';
import axios from 'axios';

// Simulasi Data Produk (Sesuaikan dengan kode API H2H / Orderkuota Anda)
const dbProduk = {
    ML: [
        { kode: 'ML36', nama: '36 Diamonds', harga: 10000 },
        { kode: 'ML74', nama: '74 Diamonds', harga: 20000 }
    ],
    FF: [
        { kode: 'FF50', nama: '50 Diamonds', harga: 8000 },
        { kode: 'FF100', nama: '100 Diamonds', harga: 15000 }
    ]
};

export default function Home() {
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({ target_id: '', zone_id: '', customer_wa: '' });
    
    const [loading, setLoading] = useState(false);
    const [qrisData, setQrisData] = useState(null);

    const handleCheckout = async () => {
        if (!selectedGame || !selectedProduct || !formData.target_id || !formData.customer_wa) {
            alert('Harap lengkapi semua data form!');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('/api/create-invoice', {
                game: selectedGame,
                target_id: formData.target_id,
                zone_id: formData.zone_id,
                product_code: selectedProduct.kode,
                amount: selectedProduct.harga,
                customer_wa: formData.customer_wa
            });

            if (res.data.success) {
                setQrisData(res.data);
            } else {
                alert('Gagal membuat transaksi: ' + res.data.message);
            }
        } catch (error) {
            alert('Terjadi kesalahan pada sistem server.');
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <main className="p-6 flex justify-center">
            <div className="w-full max-w-lg space-y-6">
                
                {/* Bagian 1: Pilih Game */}
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-emerald-400 mb-4">1. Pilih Game</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => { setSelectedGame('ML'); setSelectedProduct(null); }}
                            className={`p-4 rounded-lg font-bold border-2 transition ${selectedGame === 'ML' ? 'border-emerald-400 bg-slate-700' : 'border-slate-700 bg-slate-900 hover:border-emerald-400'}`}>
                            Mobile Legends
                        </button>
                        <button onClick={() => { setSelectedGame('FF'); setSelectedProduct(null); }}
                            className={`p-4 rounded-lg font-bold border-2 transition ${selectedGame === 'FF' ? 'border-emerald-400 bg-slate-700' : 'border-slate-700 bg-slate-900 hover:border-emerald-400'}`}>
                            Free Fire
                        </button>
                    </div>
                </div>

                {/* Bagian 2: Data Akun */}
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-emerald-400 mb-4">2. Data Akun</h2>
                    <div className="flex gap-4 mb-4">
                        <input type="text" placeholder="Masukkan ID Game" className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg outline-none focus:border-emerald-400"
                            value={formData.target_id} onChange={(e) => setFormData({...formData, target_id: e.target.value})} />
                        
                        {selectedGame === 'ML' && (
                            <input type="text" placeholder="Zone ID" className="w-1/3 p-3 bg-slate-900 border border-slate-700 rounded-lg outline-none focus:border-emerald-400"
                                value={formData.zone_id} onChange={(e) => setFormData({...formData, zone_id: e.target.value})} />
                        )}
                    </div>
                    <input type="tel" placeholder="Nomor WhatsApp" className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg outline-none focus:border-emerald-400"
                        value={formData.customer_wa} onChange={(e) => setFormData({...formData, customer_wa: e.target.value})} />
                </div>

                {/* Bagian 3: Pilih Nominal */}
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-emerald-400 mb-4">3. Pilih Nominal</h2>
                    {!selectedGame ? (
                        <p className="text-slate-400">Pilih game terlebih dahulu di atas.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {dbProduk[selectedGame].map((prod) => (
                                <button key={prod.kode} onClick={() => setSelectedProduct(prod)}
                                    className={`p-4 rounded-lg font-bold border-2 transition flex flex-col items-center ${selectedProduct?.kode === prod.kode ? 'border-emerald-400 bg-slate-700' : 'border-slate-700 bg-slate-900 hover:border-emerald-400'}`}>
                                    <span>{prod.nama}</span>
                                    <span className="text-emerald-400 text-sm mt-1">Rp {prod.harga.toLocaleString()}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tombol Bayar */}
                <button onClick={handleCheckout} disabled={loading || qrisData}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-lg rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Memproses Sistem...' : 'Bayar via QRIS'}
                </button>

                {/* Pop-up Area QRIS */}
                {qrisData && (
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center text-slate-900 mt-6 animate-fade-in">
                        <h3 className="text-xl font-bold mb-1">Silakan Scan QRIS</h3>
                        <p className="mb-4 text-sm text-slate-600">Total Bayar: <span className="font-bold text-emerald-600 text-lg">Rp {selectedProduct.harga.toLocaleString()}</span></p>
                        
                        <img src={qrisData.qris_url} alt="QRIS Code" className="mx-auto border-2 border-slate-200 rounded-xl max-w-[250px] shadow-sm" />
                        
                        <p className="text-xs text-slate-500 mt-4 font-medium">Sistem akan memproses pesanan otomatis saat dana diterima.</p>
                        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-slate-200 rounded-lg text-sm font-bold hover:bg-slate-300 transition">
                            Tutup & Buat Transaksi Baru
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
