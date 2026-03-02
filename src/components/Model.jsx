import React from "react";

const Modal = ({ title, value, onChange, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <input
          type="text"
          value={value}
          onChange={onChange}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
