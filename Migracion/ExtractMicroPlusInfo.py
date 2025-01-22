import requests
import pandas as pd

# Función para obtener datos desde un endpoint POST
def fetch_data(url, headers, payload=None):
    try:
        # Enviar la solicitud POST
        response = requests.post(url, headers=headers, json=payload)
        print(f"Status code for {url}: {response.status_code}")
        print(f"Response text for {url}: {response.text}")
        response.raise_for_status()  # Lanza una excepción si ocurre un error HTTP
        
        # Decodificar el JSON de la respuesta
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error al consultar {url}: {e}")
        return None
    except ValueError as e:
        print(f"Error al decodificar JSON de {url}: {e}")
        return None

# Definir los headers
headers = {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxRUNPTU1FUkNFIiwiaWF0IjoxNzI5NjA3OTQ4fQ.M3h41i43gq2p0Prm2SnZJN-90t8FKw_m1rV40m0-mnw",
    "uuid": "47ec7cb4-d639-4687-b588-84100abdfeb8"
}

# URLs de los endpoints
url_articulos = "https://frish.microplussql.app/services/v3/pedidos/articulos"
url_clasesarticulos = "https://frish.microplussql.app/services/v3/pedidos/clasesarticulos"

# Consultar los datos de ambos endpoints
articulos_data = fetch_data(url_articulos, headers)
clases_data = fetch_data(url_clasesarticulos, headers)

# Verificar si se obtuvieron los datos correctamente
if articulos_data and clases_data:
    try:
        # Convertir los datos a DataFrames de Pandas
        articulos_df = pd.DataFrame(articulos_data["articulos"])
        clases_df = pd.DataFrame(clases_data["clases"])
        
        # Guardar los datos en un archivo Excel con pestañas
        output_file = "datos_endpoints.xlsx"
        with pd.ExcelWriter(output_file) as writer:
            articulos_df.to_excel(writer, sheet_name="Articulos", index=False)
            clases_df.to_excel(writer, sheet_name="ClasesArticulos", index=False)
        
        print(f"Datos guardados en el archivo: {output_file}")
    except Exception as e:
        print(f"Error al procesar los datos: {e}")
else:
    print("No se pudieron obtener los datos de ambos endpoints.")
