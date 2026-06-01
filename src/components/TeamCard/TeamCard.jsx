import { useState } from "react";

import "./TeamCard.css";

export default function TeamCard({

  name,

  role,

  email,

  linkedin,

  photo,

  photoDonation

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
      ${
        showDonationPhoto
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

  <div className="blood-drop">
    🩸
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
        ✉ {email}
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