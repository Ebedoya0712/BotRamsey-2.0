# En utils.py o donde sea que pongas la lógica de filtrado

def filtros(request, clasificacion, df):
    # Recoger los parámetros de filtro de la solicitud GET
    dificultad = request.GET.get('dificultad', 'todas')
    tipo = request.GET.get('tipo', 'todas')

    # Filtrar según los parámetros recibidos
    if dificultad != 'todas':
        df = df[df['Dificultad'] == dificultad]

    if tipo != 'todas':
        df = df[df['Tipo'].isin(clasificacion.get(tipo, []))]

    return df
