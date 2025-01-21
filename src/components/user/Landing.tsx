import React,{useState} from 'react';
import { useSelector, UseSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import banner from '../../assets/20036.jpg';
import whoWeAreImage from '../../assets/greenora-banner.jpeg';
import wasteCollection from '../../assets/waste-collection.png';
import recycling from '../../assets/recycling.png';
import scrap from '../../assets/Scrap.png';
import tracking from '../../assets/tracking.png';
import ecoFriendly from '../../assets/eco-friendly.png';
import subscription from '../../assets/subsciption.png';
import wasteManagmnetIndia from '../../assets/waste-managment-india.jpg';
import AuthModal from './AuthModal';




const Landing: React.FC = () => {

    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);

    const navigate = useNavigate();

    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

    const handleBooknow = () => {
        if (isLoggedIn) {
            navigate('/make-request');
        } else {
            setShowAuthModal(true);
        }
    }

    const closeModal = () => {
        setShowAuthModal(false);
    };


    console.log("islooged in:", isLoggedIn);
    return (
        <>
            <div className="w-full mt-16 h-[50vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }}>
                {/* Optional: Content over the banner */}
                <section className="flex flex-col items-center justify-center h-full text-white bg-black bg-opacity-75 p-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center">
                        Transforming Waste into <br />
                        Sustainable <span className='text-yellow-400'>Tomorrow</span>
                    </h1>
                    <p className="mt-5 text-center text-sm sm:text-base md:text-lg font-medium">
                        Together, We Recycle, Renew, and Reimagine Our World!
                    </p>
                    <div className="flex items-center justify-center mt-6 gap-4 sm:gap-6">
                        <button className="bg-green-700 hover:bg-green-900 text-white font-medium py-2 px-4 sm:py-2 sm:px-6 md:py-1 md:px-4 lg:py-2 lg:px-6 rounded-full transition duration-300">
                            Learn More
                        </button>

                        <button onClick={handleBooknow}
                            className="bg-green-700 hover:bg-green-900 text-white font-medium py-2 px-4 sm:py-2 sm:px-6 md:py-1 md:px-4 lg:py-2 lg:px-6 rounded-full transition duration-300">
                            Book Now!
                        </button>
                    </div>

                </section>

                {/* Who We Are Section */}
                <section id='about' className="bg-green-100 p-10 sm:p-10 md:p-20 w-full">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 w-full">
                        <div className="md:w-1/2">
                            <h2 className="text-green-900 text-xl sm:text-2xl md:text-3xl font-bold mb-4">Who we are?</h2>
                            <p className="text-gray-800 text-xs md:text-sm lg:text-base leading-relaxed">
                                <strong>At Greenora,</strong> we are on a mission to revolutionize waste management by making sustainability accessible to everyone. Our innovative platform empowers individuals, communities, and businesses to take control of their waste by promoting responsible disposal, recycling, and eco-friendly practices.
                            </p>
                            <p className="mt-4 text-gray-800 text-xs md:text-sm lg:text-base leading-relaxed">
                                Driven by a vision of a cleaner, greener planet, Greenora combines technology and community engagement to transform how waste is managed, turning challenges into opportunities for a sustainable future. Together, let’s reduce, reuse, and rethink waste for a better tomorrow.
                            </p>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <img src={whoWeAreImage} alt="Waste Management" className="rounded-lg shadow-lg w-full h-full " />
                        </div>
                    </div>
                </section>

                {/* Our services section */}
                <section className="bg-gray-50 p-8 sm:p-10 md:p-20" id='services'>
                    <h2 className="text-xl sm:text-2xl md:text-3xl text-center font-bold mb-8 text-green-900">Our Services</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto px-4">
                        <div className="bg-white rounded-lg shadow-md p-6 text-start">
                            <div className="text-4xl mb-4 w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                                <img src={wasteCollection} alt="" />
                            </div>
                            <h6 className="text-base md:text-lg lg:text-xl font-semibold ">Waste Collection & Disposal</h6>
                            <p className="text-gray-700 mt-2 text-xs md:text-sm lg:text-base">
                                Efficient and eco-friendly waste collection services designed to ensure proper disposal and minimize environmental impact.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 text-start">
                            <div className="text-4xl mb-4 w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                                <img src={recycling} alt="asdfgb" />
                            </div>
                            <h6 className="text-base md:text-lg lg:text-xl font-semibold">Recycling Solutions</h6>
                            <p className="text-gray-700 mt-2 text-xs md:text-sm lg:text-base">
                                Comprehensive recycling programs that turn waste into valuable resources, promoting a circular economy and reducing landfill waste.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 text-start">
                            <div className="text-4xl mb-4  w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                                <img src={scrap} alt="" />
                            </div>
                            <h6 className="text-base md:text-lg lg:text-xl font-semibold">Scrap Collection</h6>
                            <p className="text-gray-700 mt-2 text-xs md:text-sm lg:text-base">
                                Specialized scrap collection services for old electronics, metal, and other scrap materials, ensuring safe and responsible recycling.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 text-start">
                            <div className="text-4xl mb-4 w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                                <img src={tracking} alt="" />
                            </div>
                            <h6 className="text-base md:text-lg lg:text-xl font-semibold">Real-Time Pick-up Tracking</h6>
                            <p className="text-gray-700 mt-2 text-xs md:text-sm lg:text-base">
                                Advanced tracking system that provides real-time updates on waste collection, recycling progress, and overall impact.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 text-start">
                            <div className="text-4xl mb-4 w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                                <img src={ecoFriendly} alt="" />
                            </div>
                            <h6 className="text-base md:text-lg lg:text-xl font-semibold">Eco-Friendly Awareness Programs</h6>
                            <p className="text-gray-700 mt-2 text-xs md:text-sm lg:text-base">
                                Educational initiatives and workshops aimed at raising awareness about sustainable waste management practices and environmental conservation.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 text-start">
                            <div className="text-4xl mb-4 w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                                <img src={subscription} alt="" />
                            </div>
                            <h6 className="text-base md:text-lg lg:text-xl font-semibold">Custom Plans</h6>
                            <p className="text-gray-700 mt-2 text-xs md:text-sm lg:text-base">
                                Tailored solutions for businesses, communities, and individuals to manage waste effectively and meet specific sustainability goals.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Did you know Section */}
                <section className="bg-green-100 p-10 sm:p-10 md:p-20 w-full">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 w-full">

                        <div className="md:w-1/2 flex justify-center">
                            <img src={wasteManagmnetIndia} alt="Waste Management" className="rounded-lg shadow-lg w-full h-full " />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-green-900 text-xl sm:text-2xl md:text-3xl font-bold mb-4">Did you Know?</h2>
                            <p className="text-gray-800 text-xs md:text-sm lg:text-base leading-relaxed">
                                <strong>India</strong> generates approximately <strong>170,338 tonnes</strong> of solid waste every day, but only <strong>53%</strong>  of it is treated. By <strong>2030</strong>, urban waste generation is projected to reach a staggering <strong>165 million tonnes</strong>, making efficient waste management more critical than ever. To address this, the government has implemented <strong>Extended Producer Responsibility (EPR)</strong> regulations for plastics, batteries, e-waste, and other materials, promoting recycling and a circular economy.
                                <br />
                                <strong>At Greenora</strong>, we’re dedicated to being part of the solution. One collection at a time, we aim to transform waste into a valuable resource for a sustainable future. Join us in creating a cleaner, greener tomorrow!
                                <br />
                                <span className='lg:text-sm italic'>(Source: Press Information Bureau) </span>
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {showAuthModal&&<AuthModal closeModal={closeModal} />}
        </>
    );
};

export default Landing;




