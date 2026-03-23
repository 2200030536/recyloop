import React, { useState } from 'react';

const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) => {
    return (
        <div className="dialog-overlay" onClick={onCancel}>
            <div className="dialog-box" onClick={e => e.stopPropagation()}>
                <div className="dialog-title">{title}</div>
                <div className="dialog-message">{message}</div>
                <div className="dialog-actions">
                    <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
                    <button
                        className={`btn btn-sm ${danger ? 'btn-danger' : 'btn-primary'}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
