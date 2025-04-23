import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Our Pet Hotel
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Where tails never stop wagging and purrs never fade
        </p>
      </section>

      {/* Mission Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <Image
            src="/images/about/pet-hotel.jpg"
            alt="Pet hotel facility"
            width={600}
            height={400}
            className="rounded-lg shadow-xl"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            At Paws & Stay, we believe pets deserve vacations too. Founded in (you can edit this), 
            we provide premium care with 24/7 supervision, climate-controlled rooms, 
            and daily activity reports.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>100% safety record since opening</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Certified pet care specialists</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Emergency vet on call</span>
            </li>
          </ul>
          <Button variant="secondary">Meet Our Team</Button>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Facilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Rooms",
              description: "Climate-controlled rooms with webcam access",
              icon: "🛏️"
            },
            {
              title: "Grooming",
              description: "Professional grooming with organic products",
              icon: "✂️"
            },
          
          ].map((item) => (
            <div key={item.title} className="text-center p-6 border rounded-lg">
              <span className="text-4xl mb-4 inline-block">{item.icon}</span>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ready to book for your Pet to stay in?
        </h2>
        <Button href="/services" className="mx-auto">
          View Our Services
        </Button>
      </section>
    </main>
  );
}