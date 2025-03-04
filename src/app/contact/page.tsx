'use client'
import { useState } from 'react';
import emailjs from 'emailjs-com';
import toast from 'react-hot-toast';

export default function ContactForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const templateParams = {
            from_name: firstName + ' ' + lastName,
            email,
            message
        };

        try {
            const result = await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICEID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATEID!,
                templateParams,
                process.env.NEXT_PUBLIC_EMAILJS_USERNAME!
            );
            console.log(result.text);
            toast.success('Message sent successfully!');
        } catch (error: any) {
            console.log(error.text);
            toast.error('Failed to send the message, please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="isolate bg-white px-6 py-10 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
                <div className="sm:mb-8 sm:flex sm:justify-center pt-10">
                    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                        Design and Development : <a href="https://linkedin.com/in/sai-shankar-punna"> <b> Sai Shankar</b></a>
                    </div>
                </div>

                <p className="mt-2 text-lg leading-8 text-gray-600">
                    Have any suggestions to improve the platform, or have a new feature idea? Feel free to drop a message.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                            First name
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
                            Last name
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">
                            Email
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="company"
                                id="company"
                                autoComplete="organization"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        type="submit"
                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        disabled={isLoading}
                    >
                        <a href="mailto:saishanar15052005@gmail.com">
                            Send Message
                        </a>
                    </button>
                </div>
            </form>
        </div>
    );
}
