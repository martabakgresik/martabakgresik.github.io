        // Dinamic year
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        
        // Variabel delivery cost per KM
        const deliveryCostPerKm = 2000;

        // Inisialisasi slider
        document.addEventListener('DOMContentLoaded', function() {
            const distanceSlider = document.getElementById('distanceSlider');
            distanceSlider.value = 0;
            updateSliderVisuals(0);
        });

        // Fungsi update ringkasan pesanan
        const updateOrderSummary = () => {
            const sweetSelect = document.getElementById('sweetSelect');
            const savorySelect = document.getElementById('savorySelect');
            const distance = parseFloat(document.getElementById('distanceSlider').value);
            const deliveryCost = distance * deliveryCostPerKm;
            
            let items = [];
            let total = 0;

            if (sweetSelect.value) {
                const selectedOption = sweetSelect.options[sweetSelect.selectedIndex];
                const price = parseInt(selectedOption.dataset.price);
                items.push({ name: selectedOption.text, price: price });
                total += price;
            }

            if (savorySelect.value) {
                const selectedOption = savorySelect.options[savorySelect.selectedIndex];
                const price = parseInt(selectedOption.dataset.price);
                items.push({ name: selectedOption.text, price: price });
                total += price;
            }

            const itemDetails = document.getElementById('itemDetails');
            itemDetails.innerHTML = items.length > 0 
                ? items.map(item => `
                    <div class="d-flex justify-content-between mb-2">
                        <span>${item.name.split(' - ')[0]}</span>
                        <span>Rp${item.price.toLocaleString('id-ID')}</span>
                    </div>
                `).join('')
                : '<div class="text-muted">Belum ada item dipilih</div>';

            total += deliveryCost;
            document.getElementById('totalPrice').textContent = `Rp${total.toLocaleString('id-ID')}`;
        };

        // Fungsi update tombol pesan
        const updateOrderButton = () => {
            const hasItem = document.getElementById('sweetSelect').value || 
                           document.getElementById('savorySelect').value;
            const distance = parseFloat(document.getElementById('distanceSlider').value);
            
            document.getElementById('orderBtn').disabled = !hasItem || distance > 10;
        };

        // Update slider visuals
        const updateSliderVisuals = (distance) => {
            const maxDistance = 15;
            const progressPercentage = (distance / maxDistance) * 100;
            const hue = 120 - (progressPercentage * 1.2);
            const progressColor = `hsl(${hue}, 100%, 40%)`;
            
            document.documentElement.style.setProperty('--thumb-color', progressColor);
            document.documentElement.style.setProperty('--progress-color', progressColor);
            document.getElementById('distanceProgress').style.width = `${progressPercentage}%`;
        };

        // Event listeners
        document.getElementById('sweetSelect').addEventListener('change', () => {
            updateOrderSummary();
            updateOrderButton();
        });

        document.getElementById('savorySelect').addEventListener('change', () => {
            updateOrderSummary();
            updateOrderButton();
        });

        document.getElementById('distanceSlider').addEventListener('input', function() {
            const distance = parseFloat(this.value);
            updateSliderVisuals(distance);
            document.getElementById('distanceValue').textContent = distance;
            
            let warning = '';
            if (distance > 11) {
                warning = `<div class="warning-badge"><i class="fas fa-exclamation-triangle me-2"></i>Untuk jarak di atas 10KM, pengantaran mungkin memerlukan waktu lebih lama untuk menjaga kualitas produk.</div>`;
            }
            document.getElementById('distanceWarning').innerHTML = warning;
            
            updateOrderButton();
            updateOrderSummary();
        });

        // Clipboard Functionality
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                navigator.clipboard.writeText(this.dataset.clipboardText);
                this.innerHTML = '<i class="fas fa-check me-2"></i>Tersalin!';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy me-2"></i>Salin';
                }, 2000);
            });
        });

        // WhatsApp Integration
        document.getElementById('orderBtn').addEventListener('click', function() {
            const nama = document.getElementById('nama').value;
            const alamat = document.getElementById('alamat').value;
            const telepon = document.getElementById('telepon').value;
            const kodePromo = document.getElementById('kodePromo').value;
            const sweetItem = document.getElementById('sweetSelect');
            const savoryItem = document.getElementById('savorySelect');
            const distance = document.getElementById('distanceSlider').value;
            const notes = document.getElementById('notes').value;
            const total = document.getElementById('totalPrice').textContent;
            
            let items = [];
            if (sweetItem.value) items.push(sweetItem.options[sweetItem.selectedIndex].text);
            if (savoryItem.value) items.push(savoryItem.options[savoryItem.selectedIndex].text);

            const message = `Halo, saya ingin memesan:
${items.map(item => `• ${item}`).join('\n')}

Nama: ${nama}
Alamat: ${alamat}
Nomor Telepon/WhatsApp: ${telepon}
Kode Promo: ${kodePromo || '-'}

Jarak: ${distance}KM
Catatan: ${notes || '-'}
Total: ${total}

*Harap konfirmasi ketersediaan stok dan jarak pengiriman*`;

            window.open(`https://wa.me/6281330763633?text=${encodeURIComponent(message)}`, '_blank');
        });

        // Reset Function
        function resetForm() {
            document.querySelectorAll('select').forEach(select => select.value = '');
            document.getElementById('distanceSlider').value = 0;
            document.getElementById('notes').value = '';
            document.getElementById('nama').value = '';
            document.getElementById('alamat').value = '';
            document.getElementById('telepon').value = '';
            document.getElementById('kodePromo').value = '';
            updateSliderVisuals(0);
            updateOrderSummary();
            updateOrderButton();
        }