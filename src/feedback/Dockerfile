FROM python:3.7.1

ENV PYTHONDONTWRITEBYTECODE 1
ENV FLASK_APP "main.py"
ENV FLASK_ENV "development"
ENV FLASK_DEBUG True

RUN mkdir /app
WORKDIR /app

RUN pip install -U Flask

ADD . /app

EXPOSE 80

CMD flask run --host=0.0.0.0 --port=80