import logo from '../../../assets/logo.png'
const MasakkaliLogo = () => {
    return (
        <div className='flex items-end'>
            <img src={logo} alt="" />
            <p className='text-xl sm:text-2xl font-extrabold'>Masakkali</p>
        </div>
    );
};

export default MasakkaliLogo;