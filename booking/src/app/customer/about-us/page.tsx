'use client';

import ViewServicesButton from '@/_components/Services/ViewServicesButton';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 text-white"> 
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4"> 
          PawSpace Pet Hotel and Grooming
        </h1>
        <p className="text-xl text-gray-200 max-w-3xl mx-auto">
          Your best friend’s new best friend!
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2> 
          <p className="text-gray-200 mb-4"> 
            At PawSpace Pet Hotel and Grooming, we aim to provide top-tier care and comfort
            for your beloved pets. With expert grooming services and cozy accommodations,
            we ensure your furry friends feel safe, clean, and loved.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start text-gray-200"> 
              <span className="text-blue-300 mr-2">✓</span> 
              <span>Friendly and professional pet care staff</span>
            </li>
            <li className="flex items-start text-gray-200"> 
              <span className="text-blue-300 mr-2">✓</span>
              <span>Clean, secure, and pet-friendly facilities</span>
            </li>
            <li className="flex items-start text-gray-200"> 
              <span className="text-blue-300 mr-2">✓</span>
              <span>All-day service from Monday to Sunday</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 shadow">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Visit or Contact Us</h3>
          <p className="text-gray-700 mb-2">
            📍 2nd Floor, AMJB Building, Aguinaldo Highway, Palico 4, Imus, Philippines
          </p>
          <p className="mb-2">📞 0945 302 7955</p>
          <p className="mb-2">📧 pawspace2023@gmail.com</p>
          <p className="mb-2">📱 Instagram: @pawspace_amjb</p>
          <p className="mb-2">📘 Facebook: PawSpace Pet Hotel and Grooming</p>
          <p className="">🕘 Open daily from 9:00 AM to 6:00 PM</p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12"> 
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Accommodations",
              description: "Comfortable and safe boarding for your pets",
              icon: "🏨",
            },
            {
              title: "Grooming",
              description: "Professional grooming using safe and quality products",
              icon: "✂️",
            },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 border rounded-lg bg-white text-gray-800">
              <span className="text-4xl mb-4 inline-block">{item.icon}</span>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ready to book a stay or grooming for your pet?
        </h2>
        <ViewServicesButton />
      </section>
    </main>
  );
}