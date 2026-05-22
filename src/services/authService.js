const API_URL =
  "http://44.209.168.250:9002";

// GERA CHAVE ÚNICA
function generateKey() {

  return crypto.randomUUID();
}

/* LOGIN */
export async function loginRequest(
  data
) {

  const response =
    await fetch(

      `${API_URL}/login`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "x-idempotency-key":
            generateKey()
        },

        body: JSON.stringify(
          data
        )
      }
    );

  if (!response.ok) {

    throw new Error(
      "Email ou senha inválidos"
    );
  }

  return response.json();
}

/* CADASTRO */
export async function registerRequest(
  data
) {

  const response =
    await fetch(

      `${API_URL}/user`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "x-idempotency-key":
            generateKey()
        },

        body: JSON.stringify(
          data
        )
      }
    );

  if (!response.ok) {

    throw new Error(
      "Erro ao cadastrar"
    );
  }

  return response.json();
}