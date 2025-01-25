import seaborn as sns
import matplotlib.pyplot as plt

def estilo():
    # Aplicar el estilo a los graficos
    sns.set_style("darkgrid")
    sns.set_palette("bright")
    plt.rcParams.update({
        'axes.facecolor': 'black',
        'figure.facecolor': 'black',
        'savefig.facecolor': 'black',
        'text.color': 'white',
        'axes.labelcolor': 'white',
        'xtick.color': 'white',
        'ytick.color': 'white',
        'legend.facecolor': 'black'
    })
