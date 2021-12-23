import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, FlatList, Modal, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App(){
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
      async function loadTask(){
        const taskStorage = await AsyncStorage.getItem('@task'); //Buscando tarefas ao iniciar o app

        if(taskStorage){
          setTask(JSON.parse(taskStorage));
        }
      }

      loadTask();
  }, []);

  useEffect(() => {
    async function saveTasks(){
      await AsyncStorage.setItem('@task', JSON.stringify(task)); //Salvando caso tenha alguma tarefa alterada
    }

    saveTasks();
  }, [task]);

  function handleAdd(){
    if(input === "") return;

    const data = {
      key: input,
      task: input
    };

    setTask([...task, data]);
    setOpen(false);
    setInput('');
  }

  const handleDelete = useCallback((data) => {
    const find =  task.filter(r => r.key !== data.key);
    setTask(find);
  });

  return(
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#171d31" barStyle='ligth-content'/>

      <View style={styles.content}>
        <Text style={styles.title}>Minhas Tarefas</Text>
      </View>

      <FlatList 
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false}
        data={task} //dados que vai ser apresentado
        keyExtractor={ (item) => String(item.key) } //chave unica de cada item
        renderItem={ ({ item }) => <TaskList data={item} handleDelete={handleDelete} />} //cada vez que passa no item ele renderiza
      />

      <Modal animationType='slide' transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>

          <View styles={styles.modalHeader}>
            <TouchableOpacity onPress={ () => setOpen(false) }>
              <Ionicons style={{marginLeft: 5, marginRight: 5}} name='md-arrow-back' size={40} color='#FFF'/>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Tarefa</Text>
          </View>

          <Animatable.View animation={'fadeInUp'} style={styles.modalBody}>
            <TextInput
              multiline={true}
              placeholderTextColor={'#747474'}
              autoCorrect={false}
              placeholder='Qual sua proxima tarefa?'
              style={styles.input}
              value={input}
              onChangeText={ (texto) => setInput(texto)}
            />
            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText} >Incluir</Text>
            </TouchableOpacity>
            
          </Animatable.View>

        </SafeAreaView>
      </Modal>

      <AnimatedBtn style={styles.fab} animation="bounceInUp" useNativeDriver duration={1500} onPress={ () => setOpen(true) } >
        <Ionicons name='ios-add'  size={35} color="#FFF"/>
      </AnimatedBtn>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#171d31'
  },
  title:{
    marginTop: 10,
    marginBottom: 10,
    fontSize: 28,
    textAlign: 'center',
    color: '#FFF'
  },
  fab:{
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25
  },
  modal:{
    flex:1,
    backgroundColor: '#171d31',
  },
  modalHeader:{
    marginTop: 20,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitle:{
    marginLeft: 15,
    marginTop: 10,
    fontSize: 23,
    color: '#FFF'
  },
  modalBody:{
    marginTop: 15
  },
  input:{
    backgroundColor: '#FFF',
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    
    padding: 9,
    height: 150,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 5
  },
  handleAdd:{
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    height: 40,
  },
  handleAddText:{
    fontSize: 20
  }
});