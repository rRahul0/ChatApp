import '../../App.css';

const Loader = () => {
    return (
        <div className="flex items-center justify-center flex-1 ">
            <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-600 rounded-full opacity-30 animate-ping"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 rounded-full animate-spin-slow"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
export default Loader;