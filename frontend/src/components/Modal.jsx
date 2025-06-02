// src/components/Modal.jsx
import React from 'react'

const Modal = ({ children }) => {
  console.log('[Modal.jsx] Modal open')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-500">
      <div className="bg-black p-6 rounded shadow-lg w-[800px] max-h-[90vh] overflow-y-auto relative">
        {children}
      </div>
    </div>
  )
}
  

export default Modal
