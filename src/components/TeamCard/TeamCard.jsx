import { useState } from "react";

import "./TeamCard.css";

export default function TeamCard({

  name,

  role,

  email,

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
        href={`mailto:${email}`}
        className="team-link"
      >
        {email}
      </a>

      <a
        href={linkedin}
        target="_blank"
        rel="noreferrer"
        className="team-link"
      >
        💼 Ver LinkedIn
      </a>

    </div>
  );
}