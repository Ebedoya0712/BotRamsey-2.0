import matplotlib.ticker as ticker

def procesar_datos(df):
    df['Valoracion'] = df['Valoracion'] * 100  # Escalar valores si es necesario
    return df

def formato_tiempo(ax):
    ax.xaxis.set_major_locator(ticker.MultipleLocator(120))
    ax.xaxis.set_major_formatter(
        ticker.FuncFormatter(lambda x, pos: f'{int(x // 60)}h {int(x % 60)}m' if x >= 60 else f'{int(x)}m')
    )
