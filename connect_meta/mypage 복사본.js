document.addEventListener('DOMContentLoaded', function () {
    const connectButton = document.getElementById('connectButton');
    const accountSelector = document.getElementById('accountSelector');
    const accountsDropdown = document.getElementById('accounts');
    const walletAddressSpan = document.getElementById('walletAddress');
    const walletBalanceSpan = document.getElementById('walletBalance');
    const copyButton = document.getElementById('copyButton');

    // 페이지 로드 시 저장된 계정 목록과 선택된 계정 주소를 불러와서 표시
    if (localStorage.getItem('connectedAddress') && localStorage.getItem('accountsList')) {
        const accountsList = JSON.parse(localStorage.getItem('accountsList'));
        const connectedAddress = localStorage.getItem('connectedAddress');
        const connectedBalance = localStorage.getItem('connectedBalance');

        accountsDropdown.innerHTML = accountsList.map(account =>
            `<option value="${account}" ${account === connectedAddress ? 'selected' : ''}>${account}</option>`
        ).join('');
        walletAddressSpan.innerText = connectedAddress;
        walletBalanceSpan.innerText = connectedBalance;
        accountSelector.style.display = 'block';
        copyButton.style.display = 'inline';
    }

    connectButton.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    accountsDropdown.innerHTML = accounts.map(account =>
                        `<option value="${account}">${account}</option>`
                    ).join('');
                    accountSelector.style.display = 'block';
                    localStorage.setItem('accountsList', JSON.stringify(accounts)); // 계정 목록을 로컬 스토리지에 저장
                } else {
                    accountSelector.style.display = 'none';
                    alert('No accounts found. Please make sure you have accounts in MetaMask.');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to connect MetaMask, make sure it is installed and try again.');
            }
        } else {
            alert('MetaMask is not installed!');
        }
    });

    confirmButton.addEventListener('click', async () => {
        const selectedAccount = accountsDropdown.value;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(selectedAccount);
        const balanceInEth = ethers.utils.formatEther(balance);

        localStorage.setItem('connectedAddress', selectedAccount);
        localStorage.setItem('connectedBalance', `${parseFloat(balanceInEth).toFixed(4)} ETH`);

        walletAddressSpan.innerText = selectedAccount;
        walletBalanceSpan.innerText = `${parseFloat(balanceInEth).toFixed(4)} ETH`;
        copyButton.style.display = 'inline';
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(walletAddressSpan.innerText).then(() => {
            alert('Address copied to clipboard!');
        }, err => {
            console.error('Failed to copy text:', err);
            alert('Failed to copy address.');
        });
    });
});
