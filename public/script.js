
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const cryptoInfo = document.getElementById('crypto-info');
    const balanceElement = document.getElementById('balance');

    const user = {
        username: 'Murray Daniel',
        email: 'danielmurrayofficial@gmail.com',
        password: 'Danmurray1',
        balance: 1734000
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        if (usernameInput === user.email && passwordInput === user.password) {
            document.getElementById('login').style.display = 'none';
            cryptoInfo.style.display = 'block';
            updateBalance();
            fetchCryptoData();
        } else {
            alert('Invalid login credentials!');
        }
    });

    setInterval(() => {
        user.balance += 50;
        updateBalance();
    }, 30000);

    function updateBalance() {
        balanceElement.textContent = `$${user.balance.toFixed(2)} in Bitcoin`;
    }

    function fetchCryptoData() {
        const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
        const cryptoDataContainer = document.getElementById('crypto-data');
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                cryptoDataContainer.innerHTML = '';
                data.forEach(crypto => {
                    const cryptoElement = document.createElement('div');
                    cryptoElement.classList.add('crypto');
                    cryptoElement.innerHTML = `
                        <h2>${crypto.name}</h2>
                        <p>$${crypto.current_price.toFixed(2)}</p>
                    `;
                    cryptoDataContainer.appendChild(cryptoElement);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
});

function deposit() {
    window.location.href = 'https://your-payment-gateway.com';
}

function withdraw() {
    document.getElementById('withdrawMessage').classList.remove('hidden');
    document.querySelector('.account-details').classList.add('hidden');
}

