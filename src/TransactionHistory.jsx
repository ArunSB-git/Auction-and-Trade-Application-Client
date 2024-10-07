import axios from "axios";
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import default styles for toast

function TransactionHistory() {
    const transactionHistory_endpoint = "http://localhost:8080/api/transactionHistory";
    const updateTransactionStatus_endpoint = "http://localhost:8080/api/updateTransactionStatus";

    const [transactionHistory, setTransactionHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatCurrency = (value) => {
        if (value >= 10000000) {
            return `${(value / 10000000).toFixed(2)} Cr`; // Crores
        } else if (value >= 100000) {
            return `${(value / 100000).toFixed(2)} L`; // Lakhs
        } else {
            return value.toString(); // If less than a lakh, return as is
        }
    };

    const getTransactionHistory = async () => {
        try {
            const response = await axios.get(transactionHistory_endpoint, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setTransactionHistory(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            toast.error(`Error: ${errorMessage}`); // Show error toast
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateTransactionStatus = async (transactionId, status) => {
        try {
            await axios.post(updateTransactionStatus_endpoint, {
                transactionId,
                status
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            getTransactionHistory();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            toast.error(`Error: ${errorMessage}`); // Show error toast
            console.error(err);
        }
    };

    useEffect(() => {
        getTransactionHistory();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div style={styles.container}>
            <ToastContainer />
            <div style={styles.transactionHistory}>
                <h2>Transaction History</h2>
                <div style={styles.transactionList}>
                    {transactionHistory.map((transaction) => (
                        <div key={transaction.transactionid} style={styles.transactionItem}>
                            <div style={styles.transactionDetails}>
                                <img
                                    src={transaction.player.playerImage}
                                    alt={transaction.player.playername}
                                    style={styles.playerImage}
                                />
                                <div>
                                    <p><b>{transaction.player.playername}</b></p>
                                    <p>Bid Amount: {formatCurrency(transaction.bidAmount)}</p>
                                    <p>Current market value: {formatCurrency(transaction.player.auctionPrice)}</p>
                                    <p>
                                        Status:
                                        {transaction.status === 'pending' ? (
                                            <span>
                                                <span
                                                    style={styles.tickMark}
                                                    title="Approve"
                                                    onClick={() => updateTransactionStatus(transaction.transactionid, "approved")}
                                                >
                                                    ✔️
                                                </span>
                                                <span
                                                    style={styles.crossMark}
                                                    title="Reject"
                                                    onClick={() => updateTransactionStatus(transaction.transactionid, "rejected")}
                                                >
                                                    ❌
                                                </span>
                                            </span>
                                        ) : transaction.status === 'approved' ? (
                                            <span style={styles.approved}> <b> APPROVED</b></span>
                                        ) : (
                                            <span style={styles.rejected}> <b> REJECTED</b></span>
                                        )}
                                    </p>
                                    {transaction.status === 'pending' ? (
                                        <p>Bid By: {transaction.user.username}</p>
                                    ) : transaction.status === 'approved' ? (
                                        <p>Sold To: {transaction.user.username}</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        padding: '20px',
    },
    transactionHistory: {
        flex: '1',
        padding: '10px',
    },
    transactionList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    transactionItem: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        margin: '5px',
        padding: '10px',
        width: 'calc(33.33% - 10px)',
        boxSizing: 'border-box',
    },
    transactionDetails: {
        display: 'flex',
        alignItems: 'center',
    },
    playerImage: {
        width: '150px',
        height: '150px',
        marginRight: '10px',
    },
    tickMark: {
        color: 'green',
        marginRight: '5px',
        cursor: 'pointer',
    },
    crossMark: {
        color: 'red',
        cursor: 'pointer',
    },
    approved: {
        color: 'green',
    },
    rejected: {
        color: 'red',
    },
};

export default TransactionHistory;
