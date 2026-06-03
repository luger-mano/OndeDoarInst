export function getUserLocation() {

  return new Promise(

    (resolve, reject) => {

      if (
        !navigator.geolocation
      ) {

        reject(
          new Error(
            "Geolocalização não suportada"
          )
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(

        (position) => {

          resolve({

            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude
          });
        },

        (error) => {

          reject(error);
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  );
}