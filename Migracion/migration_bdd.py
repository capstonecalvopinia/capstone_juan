import pandas as pd
import pyodbc
import random

def obtener_unit_id(nomuni):
    """Devuelve el UnitID según el valor de la columna 'nomuni'."""
    unidades = {
        'GRAMOS': 1,
        'KILOGRAMOS': 2,
        'LIBRAS': 3,
        'FUNDAS': 4
    }
    return unidades.get(nomuni.upper(), 4)  # FUNDAS por defecto

def insertar_datos_a_bd(conexion, consulta, parametros):
    """Ejecuta una consulta SQL con los parámetros dados."""
    cursor = conexion.cursor()
    cursor.execute(consulta, parametros)
    conexion.commit()

def obtener_url_imagen(nombre_producto):
    print("nombre_producto: ", nombre_producto)
    """Devuelve una URL de imagen basada en el nombre del producto."""
    # urls_por_palabra_clave = {
    #     'CORTE DE CARNE DE RES': 'https://res.cloudinary.com/duqiikl2b/image/upload/v1732073710/products/Test/zxxb1bxy7ruqc0bgb46k.png',
    #     'Pollo': 'https://res.cloudinary.com/duqiikl2b/image/upload/v1732073710/products/Test/lkzlc2jmo2k1gwnfu5st.jpg',
    #     'Pescado': 'https://example.com/imagenes/pescado.jpg',
    #     'Cerdo': 'https://res.cloudinary.com/duqiikl2b/image/upload/v1732073710/products/Test/stjqhyrrbdj11ymkrhfz.jpg',
    #     'CARNES IMPORTADAS': 'https://static.abc.es/media/bienestar/2021/09/27/tipos-de-carne-1-kWj--1200x630@abc.jpg',
    #     'FILETES LIMPIO': 'https://www.recetasnestle.com.ec/sites/default/files/styles/crop_article_banner_desktop_nes/public/2021-12/cocinar-pescado-filetes.jpg_0.jpg?itok=TgTBHYXm',
    #     "LOMOS": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTez0vZL5lwaF1_SqIH-TOsRqeymknqU2Kxug&s",
    #     "MARISCOS": "https://www.recetasnestle.com.ec/sites/default/files/2024-02/mariscos-frescos-plato-langostinos_0.jpg",
    #     "PAPAS PRECOCIDAS": "https://www.liberocorp.pe/wp-content/uploads/2021/09/4.-Receta-de-papas-fritas-precocidas-congeladas.png"
    # }
    urls_por_palabra_clave = {
        "AGUADO LB" :"https://i.ytimg.com/vi/ruCaTuZCvVo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBO70NGJo38gLSEUDxE8azgRiSNGQ",
        "ALBACORA FILETE LIMPIA LB" :"https://www.imextunaconp.com/wp-content/uploads/2018/07/dorado-454x364.jpg",
        "ALBACORA LOMO PIEL LB" :"https://productosfrescosdelmar.com/wp-content/uploads/2021/06/10001_400x.jpg",
        "ALMEJA BLANCA LB" :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLIXCkCO5Sszc8BSZJdSo_U6mTuXUAEyhiPA&s",
        "ALMEJA CONCHA LB" :"https://i.blogs.es/bde08f/conchas-finas/450_1000.jpg",
        "AROS DE CALAMAR LB" :"https://novacarnes.com/wp-content/uploads/2022/03/aros-de-calamar.jpg",
        "AROS DE CEBOLLA" :" https://imag.bonviveur.com/cortar-en-aros-la-cebolla-aros-de-cebolla.jpg",
        "ATRAVESADO KG" :" https://olimpica.vtexassets.com/arquivos/ids/711211/24011525.jpg?v=637741082317870000",
        "ATRAVESADO LB" :"https://olimpica.vtexassets.com/arquivos/ids/711211/24011525.jpg?v=637741082317870000",
        "ATUN ROJO" :"https://globalseafoods.com/cdn/shop/articles/bt4_2048x.jpg?v=1682885109",
        "BANDEJA MEJILLON CHILENO 250GR" :"https://www.maraustral.com.uy/wp-content/uploads/sites/11/2023/05/Diseno-sin-titulo-60.jpg",
        "BANDERA LB" :"https://media-cdn.tripadvisor.com/media/photo-s/19/f0/a9/c4/nuestra-deliciosa-ensalada.jpg",
        "BIFE ANCHO ANGUS KG" :"https://toptrade.com.pe/wp-content/uploads/bife-ancho-argentino-angus-top-trade-jpg.webp",
        "BIFE ANCHO FRIDOSA" :" https://apidos.hipermaxi.com//marketfile/ImageEcommerce?hashfile=b81164f_0304_43e4_99de_6bd3df1b6eae.png&co=5&size=400x400",
        "BIFE ANCHO URUGUAYO KG" :"https://canarymeat.es/wp-content/uploads/2014/04/bife-ancho-uruguay.jpg",
        "BIFE ANGOSTO ANGUS KG" :"https://toptrade.com.pe/wp-content/uploads/bife-angosto-angus-argentino-jpg.webp",
        "BIFE ANGOSTO FRIDOSA KG" :"https://www.saturnopremium.com.uy/wp-content/uploads/2017/12/bife-angosto.png",
        "BIFE ANGOSTO FRIGOR KG" :" https://frigorificomaximo.com.ar/wp-content/uploads/2020/09/DSC_1743.jpg",
        "BIFE ANGOSTO URY KG" :" https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmIJOvvIc7JkPUqZnakUk_nw5QcAU0mEbnfQ&s",
        "BIFE NACIONAL KG" :"https://pancrudo.ec/wp-content/uploads/2023/12/corte_bife_de_chorizo.jpg",
        "BIFE NACIONAL LB" :"https://pancrudo.ec/wp-content/uploads/2023/12/corte_bife_de_chorizo.jpg",
        "BONDIOLA" :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSu3SUdnzaxkYIKy4y16x_ov72gJcfx_Hx7A&s",
        "BONDIOLA DE CERDO KG" :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMuz38dwRHveQeQ-TJ06T_vaC54mIkZZiXFw&s",
        "BOTON CALAMAR LB" :"https://www.dispez.com/wp-content/uploads/2022/01/BOTONES-DE-CALAMAR-600x600-1.png",
        "CALAMAR BABY LB" :"https://st4.depositphotos.com/18601610/21675/i/450/depositphotos_216759180-stock-photo-very-fresh-baby-squids-freshly.jpg",
        "CALAMAR BABY PERUANO LB" :"https://www.freezeocean.com/wp-content/uploads/2020/04/Calamar-baby-entero.jpg",
        "CALAMAR POTA LB" :"https://www.delfinultracongelados.es/wp-content/uploads/2022/07/Pota-pescado-1024x687.jpg",
        "CALAMAR POTILLO LB" :"https://productosfrescosdelmar.com/wp-content/uploads/2021/05/c.jpg",
        "CAMARON  PYD 26-30 (1 LB)" :"https://ipescado.com/wp-content/uploads/2021/02/26-30.jpg",
        "CAMARON  PYD 31-35 (1 LB)" :"https://ipescado.com/wp-content/uploads/2021/02/31-35.jpg",
        "CAMARON BROKEN" :" https://www.gamboreseafood.com/wp-content/uploads/2020/06/Camar%C3%B3n-Crudo-Broken_5.jpg",
        "CAMARON C/C 16-20 LB" :"https://ipescado.com/wp-content/uploads/2021/02/16-20.jpg",
        "CAMARON C/C 21-25 LB" :"https://ipescado.com/wp-content/uploads/2021/02/21-25.jpg",
        "CAMARON C/C 26-30 LB" :"https://ipescado.com/wp-content/uploads/2021/02/26-30.jpg",
        "CAMARON C/C 31-35 LB" :"https://ipescado.com/wp-content/uploads/2021/02/31-35.jpg",
        "CAMARON C/C 71-80 LB" :"https://distribuidoramariscosrojo.com/wp-content/uploads/2022/04/DSC_0900.jpg",
        "CAMARON C/C U-15" :"https://ipescado.com/wp-content/uploads/2021/02/U15.jpg",
        "CAMARON ENTERO" :"https://www.maraustral.com.uy/wp-content/uploads/sites/11/2023/02/LIBRO-5.jpg",
        "CAMARON IQF PYD 16-20 LB" :"https://tecobil.com/wp-content/uploads/2021/10/7862132110018.jpg",
        "CAMARON IQF PYD 21-25 LB" :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIDIBCQfIaOCiLbwOOvQG-dUjtyYUNT2UkmQ&s",
        "CAMARON IQF PYD 26-30 LB" :"https://www.todofrio.cl/wp-content/uploads/2022/06/TodoFrio-cl-Camaron-21-25-Crudo-Sin-Cascara-Desvenado-600x600.jpg",
        "CAMARON IQF PYD 31-35 LB" :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqZultyB2NAkXKQRHg5B-A2ZNHK27N2czTFA&s",
        "CAMARON IQF PYD 41-50 LB" :"https://www.freezeocean.com/wp-content/uploads/2020/12/Camaron-para-ceviche.jpg",
        "CAMARON IQF PYD 71-90 LB" :"https://static.wixstatic.com/media/da76b9_6226503218ba4d6dbc92151c209ff417~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
        "CAMARON PYD 41-50 (1 LB)" :"https://m.media-amazon.com/images/I/51en19ZfR5L.jpg",
        "CAMARON TAILON TALLA 21-25 LB" :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx2COZ8MERrjMKiqXu1ITY79Oif9H6331n9g&s",
        "CARNES PRUEBA" :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtvO8ynQbwepq4bcTTPuzAfDOJf4g42M8N9g&s",
        "LOMO DE ATUN ROJO KG" :" https://vendedor.plus/cdn/shop/files/Atun_Lomo.png?v=1731961997",
        "PAPA MCCAIN TRADICIONAL" :"https://images.openfoodfacts.org/images/products/779/790/605/4819/front_es.18.full.jpg",
        "SUBPRODUCTO PESCADO LB" :"https://www.fao.org/4/x2098e/X2098E68.jpg"
    }

    # Busca una palabra clave en el nombre del producto
    for palabra_clave, url in urls_por_palabra_clave.items():
        print("palabra_clave: ", palabra_clave.lower())
        if palabra_clave.lower() in nombre_producto.lower():
            return url
    # URL predeterminada si no se encuentra ninguna palabra clave
    return 'https://example.com/imagenes/default.jpg'

# Conexión a la base de datos
server = "LAPTOPJOSUETHCU"
database = "frish_ecommerce"
username = "capstone_juan_login"
password = "C4pstone_p4ss"

conexion = pyodbc.connect(
    f"DRIVER={{SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password};TrustServerCertificate=yes"
)

# Leer datos desde el archivo Excel
archivo_excel = "datos_endpoints.xlsx"
df_clases_articulos = pd.read_excel(archivo_excel, sheet_name="ClasesArticulos")
df_articulos = pd.read_excel(archivo_excel, sheet_name="Articulos")

# Insertar categorías
for _, fila in df_clases_articulos.iterrows():
    nombre_categoria = fila["nomcla"]
    descripcion_categoria = f"Descripción para {nombre_categoria}"
    insertar_datos_a_bd(
        conexion,
        "INSERT INTO Category (Name, Description) VALUES (?, ?)",
        (nombre_categoria, descripcion_categoria)
    )

# Obtener categorías para mapear IDs
categorias = pd.read_sql("SELECT CategoryID, Name FROM Category", conexion)
mapa_categorias = dict(zip(categorias.Name, categorias.CategoryID))
print("mapa_categorias: ", mapa_categorias)

# Insertar productos y sus imágenes
for _, fila in df_articulos.iterrows():
    nombre_producto = fila["nomart"]
    descripcion_producto = f"Descripción para {nombre_producto}"
    precio = fila["prec01"]
    stock = random.randint(10, 100)
    is_available = 1
    unit_id = obtener_unit_id(fila["nomuni"])
    nomcla = fila["nomcla"]
    
    # Insertar producto y obtener el ProductID insertado
    cursor = conexion.cursor()
    cursor.execute(
        "INSERT INTO Product (Name, Description, Price, Stock, IsAvailable, UnitID) OUTPUT INSERTED.ProductID VALUES (?, ?, ?, ?, ?, ?)",
        (nombre_producto, descripcion_producto, precio, stock, is_available, unit_id)
    )
    producto_id = cursor.fetchone()[0]  # Obtener el ID del producto insertado
    conexion.commit()
    print("Producto:", nombre_producto, "ID:", producto_id)
    
    # Obtener ID de la categoría asociada
    categoria_id = mapa_categorias.get(nomcla)
    if categoria_id:
        insertar_datos_a_bd(
            conexion,
            "INSERT INTO CategoryProduct (ProductID, CategoryID) VALUES (?, ?)",
            (producto_id, categoria_id)
        )
    else:
        print(f"Advertencia: No se encontró una categoría para nomcla={nomcla}")

    # Obtener URL de imagen y asociarla al producto
    url_imagen = obtener_url_imagen(nombre_producto)
    insertar_datos_a_bd(
        conexion,
        "INSERT INTO Image (ImageUrl, ProductID) VALUES (?, ?)",
        (url_imagen, producto_id)
    )
    print(f"Imagen asociada al producto {nombre_producto}: {url_imagen}")

print("Datos migrados exitosamente.")
conexion.close()
