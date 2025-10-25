import React, { useState, useEffect } from 'react';
import { walletAPI, transactionAPI, Wallet, Transaction, TransferRequest } from '../services/api';

interface DashboardProps {
  userId: number;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, onLogout }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [allWallets, setAllWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferData, setTransferData] = useState({
    receiverWalletId: '',
    amount: '',
  });
  const [transferLoading, setTransferLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getGreeting = () => {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const hour = istTime.getHours();
    
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const loadWalletData = async () => {
    try {
      const walletResponse = await walletAPI.getUserWallet(userId);
      setWallet(walletResponse.data);
      
      const transactionsResponse = await transactionAPI.getHistory(walletResponse.data.id);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setMessage('Error loading wallet data');
    } finally {
      setLoading(false);
    }
  };

  const loadAllWallets = async () => {
    try {
      const response = await walletAPI.getAllWallets();
      setAllWallets(response.data);
    } catch (error) {
      console.error('Error loading all wallets:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      loadWalletData();
      loadAllWallets();
    }
  }, [userId]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    setTransferLoading(true);
    setMessage('');

    try {
      const transferRequest: TransferRequest = {
        senderWalletId: wallet.id,
        receiverWalletId: parseInt(transferData.receiverWalletId),
        amount: parseFloat(transferData.amount),
      };

      await transactionAPI.transfer(transferRequest);
      setMessage('Transfer successful!');
      setTransferData({ receiverWalletId: '', amount: '' });
      
      // Reload wallet data and all wallets
      await loadWalletData();
      await loadAllWallets();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Transfer failed. Please check the details.';
      setMessage(errorMessage);
    } finally {
      setTransferLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f7fa', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: '#2c3e50',
            fontSize: '28px',
            fontWeight: '600'
          }}>
            {getGreeting()} {wallet?.user.username || 'User'}
          </h1>
          <button 
            onClick={onLogout} 
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#e74c3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#c0392b'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e74c3c'}
          >
            Logout
          </button>
        </div>

      {wallet && (
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '30px', 
          borderRadius: '16px', 
          marginBottom: '30px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>My Wallet</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', opacity: 0.9, fontSize: '14px' }}>Wallet ID</p>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{wallet.id}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 8px 0', opacity: 0.9, fontSize: '14px' }}>Balance</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>${wallet.balance.toFixed(2)}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 8px 0', opacity: 0.9, fontSize: '14px' }}>Status</p>
              <span style={{ 
                padding: '4px 12px', 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {wallet.status}
              </span>
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '16px', 
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 25px 0', color: '#2c3e50', fontSize: '20px', fontWeight: '600' }}>Transfer Money</h3>
        <form onSubmit={handleTransfer}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e', fontWeight: '500' }}>
              Receiver Wallet ID:
            </label>
            <input
              type="number"
              value={transferData.receiverWalletId}
              onChange={(e) => setTransferData({ ...transferData, receiverWalletId: e.target.value })}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e', fontWeight: '500' }}>
              Amount:
            </label>
            <input
              type="number"
              step="0.01"
              value={transferData.amount}
              onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
            />
          </div>
          {message && (
            <div style={{ 
              color: message.includes('successful') ? '#27ae60' : '#e74c3c', 
              marginBottom: '20px',
              padding: '12px 16px',
              backgroundColor: message.includes('successful') ? '#d5f4e6' : '#fdeaea',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {message}
            </div>
          )}
          <button 
            type="submit" 
            disabled={transferLoading} 
            style={{ 
              padding: '14px 28px', 
              backgroundColor: transferLoading ? '#bdc3c7' : '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: transferLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => !transferLoading && ((e.target as HTMLButtonElement).style.backgroundColor = '#2980b9')}
            onMouseOut={(e) => !transferLoading && ((e.target as HTMLButtonElement).style.backgroundColor = '#3498db')}
          >
            {transferLoading ? 'Processing...' : 'Transfer'}
          </button>
        </form>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '16px', 
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 25px 0', color: '#2c3e50', fontSize: '20px', fontWeight: '600' }}>All Wallets</h3>
        {allWallets.length === 0 ? (
          <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>No wallets found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ 
                    padding: '16px', 
                    border: '1px solid #e9ecef', 
                    textAlign: 'left',
                    color: '#495057',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    Wallet ID
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    border: '1px solid #e9ecef', 
                    textAlign: 'left',
                    color: '#495057',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    Username
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    border: '1px solid #e9ecef', 
                    textAlign: 'right',
                    color: '#495057',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {allWallets.map((w, index) => (
                  <tr key={w.id} style={{ 
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                    transition: 'background-color 0.2s'
                  }}>
                    <td style={{ 
                      padding: '16px', 
                      border: '1px solid #e9ecef',
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      {w.id}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      border: '1px solid #e9ecef',
                      color: '#2c3e50'
                    }}>
                      {w.user.username}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      border: '1px solid #e9ecef', 
                      textAlign: 'right',
                      color: '#27ae60',
                      fontWeight: '600'
                    }}>
                      ${w.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 25px 0', color: '#2c3e50', fontSize: '20px', fontWeight: '600' }}>Transaction History</h3>
        {transactions.length === 0 ? (
          <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>No transactions found.</p>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} style={{ 
                padding: '20px', 
                borderBottom: '1px solid #e9ecef', 
                marginBottom: '16px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#7f8c8d', fontWeight: '500' }}>Transaction ID</p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#2c3e50', fontFamily: 'monospace' }}>{transaction.transactionId}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#7f8c8d', fontWeight: '500' }}>Amount</p>
                    <p style={{ margin: 0, fontSize: '16px', color: '#27ae60', fontWeight: '600' }}>${transaction.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#7f8c8d', fontWeight: '500' }}>Status</p>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d5f4e6', 
                      color: '#27ae60',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {transaction.status}
                    </span>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#7f8c8d', fontWeight: '500' }}>Date</p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#2c3e50' }}>{new Date(transaction.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
