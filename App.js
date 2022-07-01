import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Keyboard} from 'react-native';
import MoedaPicker from './src/Components/MoedaPicker';
import api from './src/services/api';

export default function App() {
  const [moedas, setMoedas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedaReal, setMoedaReal] = useState(0);
  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0);

  useEffect(()=>{
    async function loadMoedas(){
      const response = await api.get('all');
      
      let arrayMoedas = []
      Object.keys(response.data).map((key)=>{
        arrayMoedas.push({
          key: key,
          label: key,
          value: key
        })
      })
      
      setMoedas(arrayMoedas);
      setCarregando(false);
    }

    loadMoedas();
  }, []);

  async function calcular(){
    if(moedaSelecionada === null){
      alert('Nenhuma moeda selecionada para conversão.');
      return;
    }
    if(moedaReal === 0){
      alert('Valor em Reais a ser convertido não informado.');
      return;
    }
    
    const response = await api.get(`all/${moedaSelecionada}-BRL`);

    let resultado = (parseFloat(moedaReal) / response.data[moedaSelecionada].ask);
    setValorConvertido(`${resultado.toFixed(2)}`);
    setValorMoeda(moedaReal)

    Keyboard.dismiss();
  }
 
  if(carregando){
   return(
   <View style={{ justifyContent: 'center', alignItems: 'center', flex:1 }}>
    <ActivityIndicator color="#FFF" size={45} />
   </View>
   )
 }else{
  return (
    <View style={styles.container}>
 
      <View style={styles.areaMoeda}>
       <Text style={styles.titulo}>Selecione a moeda desejada:</Text>
       <MoedaPicker moedas={moedas} onChange={ (moeda) => setMoedaSelecionada(moeda) } />
      </View>
 
      <View style={styles.areaValor}>
       <Text style={styles.titulo}>Qual o valor em Reais a ser convertido?</Text>
       <TextInput
       placeholder="000000"
       style={styles.input}
       keyboardType="numeric"
       onChangeText={ (valor) => setMoedaReal(valor) }
       />
      </View>
 
     <TouchableOpacity style={styles.botaoArea} onPress={calcular}>
       <Text style={styles.botaoTexto}>Calcular</Text>
     </TouchableOpacity>
 
      {valorConvertido !== 0 && (
      <View style={styles.areaResultado}>
        <Text style={styles.valorConvertido}>
            R$ {valorMoeda} (BRL)
        </Text>
        <Text style={[styles.valorConvertido, { fontSize: 18, margin: 10 } ]}>
          Equivale a:
        </Text>
        <Text style={styles.valorConvertido}>
            {valorConvertido} {moedaSelecionada} 
        </Text>
      </View>
      )}
 
    </View>
   );
 }

}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    backgroundColor: '#101215',
    paddingTop: 40
  },
  areaMoeda:{
    width: '90%',
    backgroundColor: '#F9f9f9',
    paddingTop: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginBottom: 1,
  },
  titulo:{
    fontSize: 15,
    color: '#5C1B1D',
    paddingTop: 5,
    paddingLeft: 5,
  },
  areaValor:{
    width: '90%',
    backgroundColor: '#F9f9f9',
    paddingBottom: 9,
    paddingTop: 9
  },
  input:{
    width: '100%',
    padding: 10,
    height: 45,
    fontSize: 20,
    marginTop: 8,
    color: '#000'
  },
  botaoArea:{
   width: '90%',
   backgroundColor: '#5C1B1D',
   height: 45 ,
   borderBottomLeftRadius: 9,
   borderBottomRightRadius: 9,
   justifyContent: 'center',
   alignItems: 'center'
  },
  botaoTexto:{
    fontSize: 18,
    color:'#FFF',
    fontWeight: 'bold'
  },
  areaResultado:{
    width: '90%',
    backgroundColor:'#FFF',
    marginTop: 35,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25
  },
  valorConvertido:{
    fontSize: 39,
    fontWeight: 'bold',
    color: '#5C1B1D'
  }
});  