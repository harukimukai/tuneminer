import ReactDOM from 'react-dom'

const Modal = ({ children }) => {

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
      <div className="bg-black p-6 rounded shadow-lg w-[800px] max-h-[90vh] overflow-y-auto relative">
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // ここで別ツリーに描画
  )
}

export default Modal

