
// Scroll Animation
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.1
});

animatedElements.forEach(el => observer.observe(el));

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.createElement('button');
  toggle.classList.add('menu-toggle');
  toggle.innerHTML = '&#9776;';
  document.querySelector('.navbar').prepend(toggle);

  const navLinks = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
});

const newsletterForm = document.querySelector('.newsletter-form');
const message = document.getElementById('form-message');
const submitBtn = newsletterForm.querySelector('button');

newsletterForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent page reload

  const email = newsletterForm.email.value;

  
  submitBtn.disabled = true;
  submitBtn.textContent = "Subscribing...";

  try {
    const response = await fetch('http://localhost:5000/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const result = await response.json();

    if (response.ok) {
      message.textContent = "🎉 " + result.message;
      message.className = "form-message success";
      message.style.display = "block";
      newsletterForm.reset();
    } else {
      message.textContent = "❌ " + result.message;
      message.className = "form-message error";
      message.style.display = "block";
    }

  
    
    setTimeout(() => {
      message.style.display = "none";
    }, 5000);

  } catch (error) {
    message.textContent = "⚠️ Something went wrong. Please try again.";
    message.className = "form-message error";
    message.style.display = "block";

    // Auto-hide after 5 seconds
    setTimeout(() => {
      message.style.display = "none";
    }, 5000);

    console.error(error);
  } finally {
    // Reset button back to normal
    submitBtn.disabled = false;
    submitBtn.textContent = "Subscribe";
  }
});

// schedule

// function handleFormSubmit(formId, messageId) {
//   const form = document.getElementById(formId);
//   const messageElement = document.getElementById(messageId);

//   if (!form) {
//     console.log(`⚠️ Form with ID '${formId}' not found`);
//     return;
//   }

//   form.addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const formData = new FormData(form);
//     const data = Object.fromEntries(formData.entries());

//     try {
//       const response = await fetch("http://localhost:5000/api/schedule", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         showMessage("✅ Successfully submitted!", true);
//         form.reset();
//       } else {
//         const errorText = await response.text();
//         showMessage("❌ Failed to submit.", false);
//         console.log("Error Response:", errorText);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       showMessage("⚠️ An error occurred.", false);
//     }
//   });

//   // Reusable message with fadeout
//   function showMessage(message, isSuccess = true) {
//     const msgDiv = document.createElement("div");
//     msgDiv.textContent = message;
//     msgDiv.style.padding = "10px";
//     msgDiv.style.marginTop = "10px";
//     msgDiv.style.borderRadius = "5px";
//     msgDiv.style.textAlign = "center";
//     msgDiv.style.fontWeight = "bold";
//     msgDiv.style.opacity = "1"; // start fully visible
//     msgDiv.style.transition = "opacity 1s ease"; // fadeout effect

//     if (isSuccess) {
//       msgDiv.style.backgroundColor = "#d4edda"; // light green
//       msgDiv.style.color = "#155724"; // dark green text
//     } else {
//       msgDiv.style.backgroundColor = "#f8d7da"; // light red
//       msgDiv.style.color = "#721c24"; // dark red text
//     }

//     document.body.appendChild(msgDiv);

//     // Start fading out after 4 seconds
//     setTimeout(() => {
//       msgDiv.style.opacity = "0"; 
//       setTimeout(() => msgDiv.remove(), 1000); // remove after fade
//     }, 4000);
//   }
// }

// // Attach to all forms
// handleFormSubmit("scheduleForm", "scheduleMessage");
// handleFormSubmit("oneOnOneForm", "oneOnOneMessage");
// handleFormSubmit("onlineMeetingForm", "onlineMeetingMessage");

function handleFormSubmit(formId, messageId, endpoint) {
  const form = document.getElementById(formId);

  if (!form) {
    console.log(`⚠️ Form with ID '${formId}' not found`);
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        showMessage(`✅ ${result.message || "Successfully submitted!"}`, true);
        form.reset();
      } else {
        showMessage(`❌ ${result.message || "Failed to submit."}`, false);
        console.error("Error Response:", result);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      showMessage("⚠️ An error occurred.", false);
    }
  });

  function showMessage(message, isSuccess = true) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = message;
    msgDiv.style.padding = "10px";
    msgDiv.style.marginTop = "10px";
    msgDiv.style.borderRadius = "5px";
    msgDiv.style.textAlign = "center";
    msgDiv.style.fontWeight = "bold";
    msgDiv.style.opacity = "1";
    msgDiv.style.transition = "opacity 1s ease";

    if (isSuccess) {
      msgDiv.style.backgroundColor = "#d4edda";
      msgDiv.style.color = "#155724";
    } else {
      msgDiv.style.backgroundColor = "#f8d7da";
      msgDiv.style.color = "#721c24";
    }

    document.body.appendChild(msgDiv);

    setTimeout(() => {
      msgDiv.style.opacity = "0"; 
      setTimeout(() => msgDiv.remove(), 1000);
    }, 4000);
  }
}

// Attach to schedule forms
handleFormSubmit("scheduleForm", "scheduleMessage", "schedule");
handleFormSubmit("oneOnOneForm", "oneOnOneMessage", "schedule");
handleFormSubmit("onlineMeetingForm", "onlineMeetingMessage", "schedule");

// Attach to contact form
handleFormSubmit("contactForm", "contactMessage", "contact");
