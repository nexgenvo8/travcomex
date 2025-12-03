import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import CrossIcon from 'react-native-vector-icons/Entypo';

const ModalView = ({setModalOpen, modalUse}) => {
  const [keySkills, setKeySkills] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalInitialized, setIsModalInitialized] = useState(false);
  console.log('keySkills', keySkills,);
  useEffect(() => {
    if (modalUse === 'KeySkills') {
      setKeySkills(true); // Update `keySkills` when `modalUse` matches
    }
  }, [modalUse]);

  useEffect(() => {
    if (keySkills) {
      setIsModalInitialized(true); // Ensure initialization is flagged after `keySkills` updates
      setIsModalVisible(true); // Open the modal
    }
  }, [keySkills]);

  if (!isModalInitialized) {
    return null; // Prevent modal rendering until initialization is complete
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        setIsModalVisible(false);
        setModalOpen(false); // Notify parent to close modal
      }}>
      <View style={styles.centeredView}>
        <View style={{...styles.modalView, flex: 0.6, padding: 20}}>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(false);
              setModalOpen(false);
            }}
            style={{alignSelf: 'flex-end'}}>
            <CrossIcon name="cross" size={25} color="#000" />
          </TouchableOpacity>
          {keySkills && (
            <View style={styles.centeredView}>
              <View style={{alignItems: 'center', borderBottomWidth: 0.2}}>
                <Text style={{fontSize: 18, padding: 15, fontWeight: '700'}}>
                  Comments
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    flex: 0.44,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 35,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ModalView;
