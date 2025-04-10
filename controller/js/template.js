const header = ` <header class="md:hidden">
    <h1>Titre</h1>
</header>
`;

const footer = `<footer class="md:hidden"
    <img src="/Clicker/public/assets/inventory.png" alt="">
    <img src="/Clicker/public/assets/kama.png" alt="">
    <img src="/Clicker/public/assets/store.png" alt="">
</footer>
`;

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('body').innerHTML = header;
    if (header) {
        document.querySelector('body').innerHTML = footer;
    }
});