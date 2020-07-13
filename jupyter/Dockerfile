from jupyter/tensorflow-notebook
run mkdir /home/jovyan/notebooks && chown jovyan /home/jovyan/notebooks
volume /home/jovyan/notebooks
entrypoint ["jupyter", "notebook", "--ip=0.0.0.0", "--no-browser", "--port", "8888", "--NotebookApp.token='secret'", "--NotebookApp.password=''", "--NotebookApp.allow_origin='*'", "--notebook-dir=/home/jovyan/notebooks", "--NotebookApp.base_url=/jupyter"]
