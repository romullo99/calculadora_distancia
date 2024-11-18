import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapRegion, setMapRegion] = useState(null); 
  const [userAddress, setUserAddress] = useState(null); 

  const isValidCep = (cep) => {
    return /^[0-9]{8}$/.test(cep);
  };

  const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lon - coords1.lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coords1.lat)) *
        Math.cos(toRad(coords2.lat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Habilite o acesso à localização.');
        return;
      }
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      console.log('Localização obtida:', location);
      if (location.coords) {
        setCurrentLocation({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });
        setShowMap(true);
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (geocode.length > 0) {
          const { street, city, region, country } = geocode[0];
          setUserAddress(`${street}, ${city}, ${region}, ${country}`);
        }
      } else {
        Alert.alert('Erro', 'Não foi possível obter a localização.');
      }
      setLoading(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização.');
      console.log('Erro ao obter localização:', error);
      setLoading(false);
    }
  };

  const fetchCepLocation = async () => {
    if (!isValidCep(cep)) {
      Alert.alert('Erro', 'Por favor, insira um CEP válido.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        Alert.alert('Erro', 'CEP não encontrado.');
        setLoading(false);
        return;
      }
      const { logradouro, bairro, localidade, uf } = response.data;
      const fullAddress = `${logradouro}, ${bairro}, ${localidade} - ${uf}`;
      setAddress(fullAddress);

      const coords = await Location.geocodeAsync(fullAddress);
      if (coords.length > 0) {
        const destination = {
          lat: coords[0].latitude,
          lon: coords[0].longitude,
        };
        setMapRegion({
          latitude: destination.lat,
          longitude: destination.lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        if (currentLocation) {
          const dist = haversineDistance(currentLocation, destination);
          setDistance(dist.toFixed(2));
        }
      } else {
        Alert.alert('Erro', 'Não foi possível encontrar o endereço do CEP.');
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema ao buscar o CEP. Verifique sua conexão com a internet.');
      setLoading(false);
    }
  };

  const clearFields = () => {
    setCep('');
    setAddress(null);
    setDistance(null);
    setCurrentLocation(null);
    setShowMap(false);
    setMapRegion(null); 
    setUserAddress(null); 
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Calculadora de Distância</Text>
      <Button title="Obter Minha Localização" onPress={getCurrentLocation} disabled={loading} />
      
      {userAddress && (
        <Text style={styles.info}>
          <Text style={styles.label}>Endereço do celular: </Text>
          {userAddress}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Digite o CEP"
        keyboardType="numeric"
        value={cep}
        onChangeText={setCep}
        disabled={loading}
      />
      
      <Button 
        title="Buscar Endereço e Calcular Distância" 
        onPress={fetchCepLocation} 
        disabled={loading || !isValidCep(cep)} 
      />
      
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      
      {address && (
        <Text style={styles.info}>
          <Text style={styles.label}>Endereço: </Text>
          {address}
        </Text>
      )}

      {distance && (
        <Text style={styles.info}>
          <Text style={styles.label}>Distância: </Text>
          {distance} km
        </Text>
      )}

      {showMap && mapRegion && (
        <MapView
          style={styles.map}
          region={mapRegion} 
        >
          {currentLocation && (
            <Marker coordinate={{ latitude: currentLocation.lat, longitude: currentLocation.lon }} title="Minha Localização" />
          )}
          {mapRegion && (
            <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} title="Local do CEP" />
          )}
        </MapView>
      )}

      <Button title="Limpar Campos" onPress={clearFields} style={styles.clearButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  input: {
    width: '90%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 16,
    marginBottom: 16,
  },
  info: {
    width: '90%',
    fontSize: 16,
    padding: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#34495e',
  },
  loader: {
    marginTop: 20,
  },
  map: {
    width: '90%',
    height: 300,
    marginTop: 20,
    borderRadius: 8,
  },
  clearButton: {
    marginTop: 20,
  },
});
