

export default function Modal({ children, show, event, details }) {

  const { title, btnTxt } = details;

  return (
    <div>
      {show && (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                
                {/* HEADER */}
                <div className="flex items-center justify-center p-4 rounded-t">
                  <h2 className="text-base font-bold">{title}</h2>
                </div>


                {/* BODY */}
                <div className="relative px-6 flex-auto">
                  <div className="flex justify-center">
                    { children }
                  </div>
                </div>


                {/* FOOTER */}
                <div className="flex items-center justify-center p-4 rounded-b">
                  <button
                    className="bg-green-700 active:bg-green-700 text-white text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => event()}
                  >
                    {btnTxt}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
