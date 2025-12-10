export default function Error({ erorMSG, onClick }: { erorMSG: string, onClick: () => void} ) {
    return (
        <div onClick={onClick} className="bg-red-500 text-white p-4 mb-4 rounded-xl absolute border-4 border-red-700 text-xl">
            <h1>{erorMSG}</h1>
        </div>
    )    
}