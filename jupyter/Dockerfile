from jupyter/tensorflow-notebook
#from cschranz/gpu-jupyter
run mkdir /home/jovyan/notebooks && chown jovyan /home/jovyan/notebooks
user root
run apt-get update && \
  apt-get install -y libpq-dev && \
  pip install psycopg2
user jovyan
volume /home/jovyan/notebooks
entrypoint ["jupyter", "notebook", "--ip=0.0.0.0", "--no-browser", "--port", "8888", "--NotebookApp.token='secret'", "--NotebookApp.password=''", "--NotebookApp.allow_origin='*'", "--notebook-dir=/home/jovyan/notebooks", "--NotebookApp.base_url=/jupyter"]
