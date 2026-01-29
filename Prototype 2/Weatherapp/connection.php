<?php
$serverName = "localhost";
$userName = "root";
$password = "";

//To Create connection
$conn = mysqli_connect($serverName, $userName, $password);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// To Create database
$createDatabase = "CREATE DATABASE IF NOT EXISTS prototype2";
mysqli_query($conn, $createDatabase);

// To Select database
mysqli_select_db($conn, 'prototype2');

$createTable = "CREATE TABLE IF NOT EXISTS weather (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    temperature FLOAT NOT NULL,
    weather_condition VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    humidity FLOAT NOT NULL,
    pressure FLOAT NOT NULL,
    wind_speed FLOAT NOT NULL,
    wind_direction FLOAT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    date_formatted VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX(city)
)";
mysqli_query($conn, $createTable);

//To Get city name from query parameter
if (isset($_GET['q'])) {
    $cityName = mysqli_real_escape_string($conn, $_GET['q']);
} else {
    $cityName = "Bolton";
}

// To Check if data exists and is less than 2 hours old
$selectAllData = "SELECT *, TIMESTAMPDIFF(HOUR, timestamp, NOW()) as hours_old 
                  FROM weather 
                  WHERE city = '$cityName' 
                  AND TIMESTAMPDIFF(HOUR, timestamp, NOW()) < 2
                  ORDER BY timestamp DESC 
                  LIMIT 1";

$result = mysqli_query($conn, $selectAllData);

// If recent data not found then fetch from API
if (mysqli_num_rows($result) == 0) {
    $apiKey = "914bfeb7b6cb8e3391743df1fedfa649";
    $url = "https://api.openweathermap.org/data/2.5/weather?q={$cityName}&appid={$apiKey}&units=metric";
    
    $response = file_get_contents($url);
    $data = json_decode($response, true);
    
    if ($data['cod'] == 200) {
        $city = mysqli_real_escape_string($conn, $data['name']);
        $temperature = $data['main']['temp'];
        $weather_condition = mysqli_real_escape_string($conn, $data['weather'][0]['main']);
        $description = mysqli_real_escape_string($conn, $data['weather'][0]['description']);
        $humidity = $data['main']['humidity'];
        $pressure = $data['main']['pressure'];
        $wind_speed = $data['wind']['speed'];
        $wind_direction = $data['wind']['deg'];
        $icon = $data['weather'][0]['icon'];
        $date = new DateTime();
        $date->setTimestamp($data['dt']);
        $date_formatted = $date->format('l, F j, Y');
        
        // Insert new data
        $insertData = "INSERT INTO weather 
                      (city, temperature, weather_condition, description, humidity, pressure, wind_speed, wind_direction, icon, date_formatted) 
                      VALUES 
                      ('$city', '$temperature', '$weather_condition', '$description', '$humidity', '$pressure', '$wind_speed', '$wind_direction', '$icon', '$date_formatted')";
        
        mysqli_query($conn, $insertData);
        
        // Fetch the newly inserted data
        $result = mysqli_query($conn, $selectAllData);
    } else {
        echo json_encode(['error' => 'City not found']);
        exit;
    }
}

// Fetch all data for the city
$rows = [];
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($rows);

mysqli_close($conn);
?>
