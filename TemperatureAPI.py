# %%
# Configurar a API com Flask
from flask import Flask, request, jsonify
from pyspark.sql import SparkSession
from pyspark.sql.functions import avg
from pyspark.sql import SparkSession
from pyspark.sql.functions import avg, to_date, col
import pyspark.sql.functions as f

# %%
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# %%
# Inicializar a SparkSession
spark = SparkSession.builder \
    .appName("Global Temperature Analysis by date by city API") \
    .getOrCreate()

# %%
# Carregar o dataset limpo
df = spark.read.csv('cleanedUnico_bytemperature_bydatabycity.csv', header=True, inferSchema=True)


# %%
# Certificar-se de que a coluna 'dt' está no formato de data
df = df.withColumn("dt", to_date(col("dt")))

# %%
@app.route('/get_countrys_temperature', methods=['GET'])
def get_temperature_by_country():
    country = request.args.get('country')
    df_filtered = df.filter(df['Country'] == country)
    avg_temp = df_filtered.agg(avg("AverageTemperature").alias("AverageTemperature")).collect()

    if avg_temp:
        temperature = avg_temp[0]['AverageTemperature']
        return jsonify({'country': country, 'average_temperature': temperature})
    else:
        return jsonify({'error': 'Country not found'}), 404

# %%
@app.route('/get_temperature_by_date_country', methods=['GET'])
def get_temperature_by_date_country():
    country = request.args.get('country')
    date = request.args.get('date')
    df_filtered = df.filter((df['Country'] == country) & (df['dt'] == date))
    avg_temp = df_filtered.agg(avg("AverageTemperature").alias("AverageTemperature")).collect()

    if avg_temp:
        temperature = avg_temp[0]['AverageTemperature']
        return jsonify({'country': country, 'date': date, 'average_temperature': temperature})
    else:
        return jsonify({'error': 'Temperature data not found for the given country and date'}), 404

# %%
@app.route('/get_temperature_by_city_date', methods=['GET'])
def get_temperature_by_city_date():
    city = request.args.get('city')
    date = request.args.get('date')
    df_filtered = df.filter((df['City'] == city) & (df['dt'] == date))
    avg_temp = df_filtered.agg(avg("AverageTemperature").alias("AverageTemperature")).collect()

    if avg_temp:
        temperature = avg_temp[0]['AverageTemperature']
        return jsonify({'city': city, 'date': date, 'average_temperature': temperature})
    else:
        return jsonify({'error': 'Temperature data not found for the given city and date'}), 404

# %%
@app.route('/get_temperature_by_country_city', methods=['GET'])
def get_temperature_by_country_city():
    country = request.args.get('country')
    city = request.args.get('city')
    df_filtered = df.filter((df['Country'] == country) & (df['City'] == city))
    avg_temp = df_filtered.agg(avg("AverageTemperature").alias("AverageTemperature")).collect()

    if avg_temp:
        temperature = avg_temp[0]['AverageTemperature']
        return jsonify({'country': country, 'city': city, 'average_temperature': temperature})
    else:
        return jsonify({'error': 'Temperature data not found for the given country and city'}), 404

# %%
@app.route('/get_temperature_by_country_date_range', methods=['GET'])
def get_temperature_by_country_date_range():
    country = request.args.get('country')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    df_filtered = df.filter(
        (df['Country'] == country) &
        (df['dt'] >= start_date) &
        (df['dt'] <= end_date)
    )
    
    df_filtered = df_filtered.select('dt', 'AverageTemperature').orderBy('dt')
    results = df_filtered.collect()
    
    if results:
        temperatures = [{'date': row['dt'].strftime('%Y-%m-%d'), 'temperature': row['AverageTemperature']} for row in results]
        return jsonify({'country': country, 'temperature_data': temperatures})
    else:
        return jsonify({'error': 'Temperature data not found for the given country and date range'}), 404


# %%
@app.route('/get_countries', methods=['GET'])
@cross_origin()
def get_countries():
    
    df_filtered = df.select('Country').distinct().rdd.flatMap(list).collect()
    
    if df_filtered:
        return jsonify({'countries': df_filtered})
    else:
        return jsonify({'error': 'There is no countries founded'}), 404
    

    # %%
@app.route('/get_cities', methods=['GET'])
def get_cities():
    
    df_filtered = df.groupBy('Country').agg(f.collect_set('City')).distinct().collect()

    if df_filtered:
        dictionary = {}
        rows = len(df_filtered)
        columns = len(df_filtered[0])
        for i in range(rows):
            for j in range(columns):
                value = df_filtered[i][j]
                if (value != 0):
                    dictionary[df_filtered[i][0]] = value
        print(dictionary)
        return jsonify({'countries': dictionary})
    else:
        return jsonify({'error': 'There is no countries founded'}), 404

# %%
if __name__ == "__main__":
    app.run(port=5003)


