import { create } from 'zustand';

// Define the store's type
interface ModalState {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

// Create the Zustand store with types
const useModalStore = create<ModalState>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));

export default useModalStore;
