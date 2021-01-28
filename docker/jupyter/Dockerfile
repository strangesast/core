#from tensorflow/tensorflow:nightly-gpu-jupyter
from tensorflow/tensorflow:2.3.0rc1-gpu-jupyter

run apt-get update && \
  apt-get install -y libpq-dev && \
  pip install psycopg2 seaborn pandas

volume /home/jovyan/work
entrypoint ["jupyter", "notebook", "--allow-root", "--ip=0.0.0.0", "--no-browser", "--port", "8888", "--NotebookApp.token='secret'", "--NotebookApp.password=''", "--NotebookApp.allow_origin='*'", "--notebook-dir=/home/jovyan/work", "--NotebookApp.base_url=/jupyter/"]
