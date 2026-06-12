import { useState } from "react";

import "./TeamCard.css";

export default function TeamCard({

  name,

  role,

  linkedin,

  photo,

  photoDonation,

  bloodType

}) {

  const [showDonationPhoto,
    setShowDonationPhoto] = useState(false);

  return (

    <div className="team-card">

      <div
        className="team-photo-wrapper"
        onClick={() =>
          setShowDonationPhoto(
            !showDonationPhoto
          )
        }
      >

        <div
          className={`
      photo-flip
      ${showDonationPhoto
              ? "flipped"
              : ""
            }
    `}
        >

          <div className="photo-face">

            <img
              src={photo}
              alt={name}
              className="team-photo"
            />

          </div>

          <div className="photo-face photo-back">

            <img
              src={photoDonation}
              alt={name}
              className="team-photo"
            />

          </div>

        </div>

        <div className="member-blood-badge">
          {bloodType === "?" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" />
            </svg>
          ) : (
            <span>{bloodType}</span>
          )}
        </div>

      </div>

      <h3>
        {name}
      </h3>

      <p className="team-role">
        {role}
      </p>

      

     <a
  href={linkedin}
  target="_blank"
  rel="noreferrer"
  className="team-linkedin"
  aria-label="LinkedIn"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="#0A66C2"
  >
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.1c.7-1.3 2.4-2.7 4.9-2.7 5.2 0 6.2 3.4 6.2 7.8V24h-5v-7.7c0-1.8 0-4.2-2.6-4.2s-3 2-3 4.1V24h-5V8z"/>
  </svg>
</a>

    </div>
  );
}