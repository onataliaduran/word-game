import { FiDelete, FiCornerDownLeft } from 'react-icons/fi';

export const Keyboard = ({ keys, keyHandler, deleteHandler, submitWordHandler }) => {
  return (
    <div className="bg-neutral-100 p-5 rounded-md">
      <div className="bg-neutral-100 grid grid-cols-10 gap-1">
        {keys.map((key) => {
          return (
            <button onClick={() => keyHandler(key.symbol)} key={key.id} className="bg-neutral-200 px-2 py-2 rounded-sm flex justify-center items-center">
              <p className="uppercase text-neutral-700 text-xs font-semibold">{key.symbol}</p>
            </button>
          )
        })}
        <button className="bg-neutral-200 px-2 py-2 rounded-sm flex justify-center items-center">
          <p className="text-neutral-700 " onClick={deleteHandler}>
            <FiDelete />
          </p>
        </button>
        <button className="col-span-2 bg-green-700 px-2 py-2 rounded-sm flex justify-center items-center">
          <p className="text-white " onClick={submitWordHandler}>
            <FiCornerDownLeft />
          </p>
        </button>
      </div>
    </div>
  )
}
