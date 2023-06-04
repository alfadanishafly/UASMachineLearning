Extension ini berbasis API Django yang masih menggunakan local server, sehingga untuk menggunakannya anda perlu mengaktifkan server lokal dari API Django
sebelum itu, pastikan anda menginstall extension ini pada chrome anda, caranya adalah :
1. Buka extension pada chrome anda
2. klik load unpacked pada pojok kiri atas
3. select folder extension yang telah anda unduh dari github kami

Untuk mengaktifkan server dari API Django bisa dilakukan dengan cara : 
1. buka VSCode
2. buka terminal
3. samakan direktori dengan file manage.py
4. jalankan script berikut "python manage.py runserver"

PS :
- sebelum itu, pastikan bahwa direktori model pada file views.py sudah sama dengan direktori model pada komputer anda, sekali lagi extension ini masih berbentuk lokal. 
- untuk mengecek apakah extension ini berjalan dengan lancar, and bisa melakukan inspect element dengan mengklik f12 pada lama chrome, kemudian lihat pada bagian network dan console
