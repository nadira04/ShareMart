import {
  MousePointerClick,
  Search,
  Handshake,
  Heart,
  ArrowRight,
} from "lucide-react";

function HowItWorks() {

  const steps = [
    {
      number: "1",
      title: "Choose Your Action",
      text: "Donate food, grab discount food, or buy/sell items.",
      icon: <MousePointerClick />,
    },
    {
      number: "2",
      title: "List or Search",
      text: "List your items or search for what you need.",
      icon: <Search />,
    },
    {
      number: "3",
      title: "Connect & Transact",
      text: "Connect with donors/buyers and complete the deal.",
      icon: <Handshake />,
    },
    {
      number: "4",
      title: "Make an Impact",
      text: "Reduce waste, save money, and help the community.",
      icon: <Heart />,
    },
  ];

  return (
    <section className="how-section">

      <div className="container">

        <div className="how-header">

          <span className="section-label">
            SIMPLE & EASY
          </span>

          <h2>How ShareMart Works</h2>

          <p>
            Whether you want to donate, save money, or give old products a
            second life, ShareMart makes it simple.
          </p>

        </div>


        <div className="steps-container">

          {steps.map((step, index) => (

            <div className="step-wrapper" key={index}>

              <div className="step-card">

                <div className="step-icon">
                  {step.icon}
                </div>

                <div className="step-content">

                  <div className="step-title">

                    <span>{step.number}</span>

                    <h3>{step.title}</h3>

                  </div>

                  <p>{step.text}</p>

                </div>

              </div>


              {index !== steps.length - 1 && (
                <ArrowRight className="step-arrow" />
              )}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;