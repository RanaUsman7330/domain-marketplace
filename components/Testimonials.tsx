export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechStart Inc",
      text: "Found the perfect domain for our startup. The process was seamless and the support team was incredibly helpful.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      company: "LuxeBrand Co",
      text: "Premium domains at reasonable prices. Definitely the best marketplace I've used.",
      rating: 5
    },
    {
      name: "Michael Chen",
      company: "Growth Labs",
      text: "Exceptional selection and customer service. Highly recommend!",
      rating: 5
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Join thousands of satisfied customers who found their perfect domain
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-gray-600 text-sm">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}