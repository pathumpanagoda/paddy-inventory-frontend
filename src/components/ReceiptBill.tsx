import React from 'react';
import { X, Printer } from 'lucide-react';

interface PaddyEntry {
  id: string;
  bundles: number;
  weight: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

interface PaddyType {
  id: string;
  name: string;
  description: string;
  defaultRate: number;
  createdAt: string;
}

interface ReceiptBillProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  paddyType: PaddyType;
  entries: PaddyEntry[];
  rate: number;
  date: string;
  billNumber: string;
}

const ReceiptBill: React.FC<ReceiptBillProps> = ({
  isOpen,
  onClose,
  customer,
  paddyType,
  entries,
  rate,
  date,
  billNumber
}) => {
  if (!isOpen) return null;

  const totalBundles = entries.reduce((sum, entry) => sum + entry.bundles, 0);
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  const subtotal = totalWeight * rate;
  const taxRate = 0; // No tax for paddy sales typically
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${billNumber}</title>
              <style>
                body { 
                  font-family: 'Courier New', monospace; 
                  margin: 0; 
                  padding: 20px;
                  font-size: 12px;
                  line-height: 1.4;
                }
                .receipt { 
                  width: 300px; 
                  margin: 0 auto;
                  border: 1px solid #000;
                  padding: 10px;
                }
                .center { text-align: center; }
                .bold { font-weight: bold; }
                .line { border-bottom: 1px dashed #000; margin: 5px 0; }
                .double-line { border-bottom: 2px solid #000; margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; }
                th, td { text-align: left; padding: 2px 0; }
                .right { text-align: right; }
                .item-row td { border-bottom: 1px dotted #ccc; }
                @media print {
                  body { margin: 0; padding: 0; }
                  .receipt { border: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Receipt Bill</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
              title="Print Receipt"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-4">
          <div id="receipt-content" className="font-mono text-sm">
            {/* Business Header */}
            <div className="text-center mb-4">
              <div className="text-lg font-bold mb-1">NIMSARA SAHAL</div>
              <div className="text-sm">PADDY INVENTORY MANAGEMENT</div>
              <div className="text-xs">KOLLAM, KERALA.</div>
              <div className="text-xs">PHONE: +94 77 123 4567</div>
              <div className="text-xs">GSTIN: 32IDNAP1991T1Z8</div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3"></div>

            {/* Invoice Details */}
            <div className="text-center mb-3">
              <div className="font-bold">Tax Invoice</div>
            </div>

            <div className="mb-3 text-xs">
              <div>Bill No: {billNumber}</div>
              <div>Date: {new Date(date).toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB', { hour12: false })}</div>
              <div>Customer: {customer.name}</div>
              <div>Phone: {customer.phone}</div>
              <div>Payment Mode: Cash</div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3"></div>

            {/* Items Table */}
            <table className="w-full text-xs mb-3">
              <thead>
                <tr className="border-b border-gray-400">
                  <th className="text-left py-1">Item</th>
                  <th className="text-center py-1">Qty</th>
                  <th className="text-right py-1">Rate</th>
                  <th className="text-right py-1">Amt</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry.id} className="border-b border-dotted border-gray-300">
                    <td className="py-1">
                      {index + 1}. {paddyType.name} {entry.bundles} Bundle{entry.bundles > 1 ? 's' : ''}
                    </td>
                    <td className="text-center py-1">{entry.weight}kg</td>
                    <td className="text-right py-1">{rate.toFixed(2)}</td>
                    <td className="text-right py-1">{(entry.weight * rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-dashed border-gray-400 my-3"></div>

            {/* Summary */}
            <div className="text-xs mb-3">
              <div className="flex justify-between">
                <span>Total Bundles:</span>
                <span>{totalBundles}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Weight:</span>
                <span>{totalWeight} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Sub Total:</span>
                <span>Rs.{subtotal.toFixed(2)}</span>
              </div>
              {taxAmount > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>CGST @ {taxRate/2}% on Rs.{subtotal.toFixed(2)}:</span>
                    <span>{(taxAmount/2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST @ {taxRate/2}% on Rs.{subtotal.toFixed(2)}:</span>
                    <span>{(taxAmount/2).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-double border-gray-600 my-3"></div>

            {/* Total */}
            <div className="flex justify-between font-bold text-base mb-3">
              <span>TOTAL</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3"></div>

            {/* Footer */}
            <div className="text-center text-xs">
              <div className="mb-2">!!! Thank You !!!</div>
              <div className="text-right">E & O E</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptBill;