import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import Categories from './Categories';
import axiosInstance from "../../../api/axios";


jest.mock('./CategoryFormDialog', () => {
  return {
    __esModule: true,
    default: (props: any) =>
      props.open ? (
        <div data-testid="form-dialog">
          {props.category ? `Edit: ${props.category.name}` : 'New Category'}
        </div>
      ) : null,
  };
});

// Mock del cliente axiosInstance
jest.mock("../../../api/axios");
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('Categories component', () => {
  const mockData = [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Culture' },
    { id: '3', name: 'Health' },
  ];

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          items: mockData,
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders categories from API', async () => {
    render(<Categories />);
    await waitFor(() => expect(screen.getByText('Technology')).toBeInTheDocument());

    expect(mockedAxios.get).toHaveBeenCalled();
    for (const cat of mockData) {
      expect(screen.getByText(cat.name)).toBeInTheDocument();
    }
  });

  it('filters categories by name', async () => {
    render(<Categories />);
    await waitFor(() => expect(screen.getByText('Technology')).toBeInTheDocument());

    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'cul' } });

    expect(screen.queryByText('Technology')).not.toBeInTheDocument();
    expect(screen.getByText('Culture')).toBeInTheDocument();
  });

  it('opens the modal when clicking New Category', async () => {
    render(<Categories />);
    await waitFor(() => expect(screen.getByText('Technology')).toBeInTheDocument());

    const button = screen.getByText('Nueva categoría');
    fireEvent.click(button);

    expect(screen.getByTestId('form-dialog')).toHaveTextContent('New Category');
  });

  it('deletes a category when confirmed', async () => {
    window.confirm = jest.fn(() => true);
    mockedAxios.delete.mockResolvedValue({});
    render(<Categories />);
    await waitFor(() => expect(screen.getByText('Technology')).toBeInTheDocument());

    const deleteButtons = screen.getAllByTestId('DeleteIcon').map((icon) =>
      icon.closest('button')!
    );
    fireEvent.click(deleteButtons[0]);

    await waitFor(() =>
      expect(mockedAxios.delete).toHaveBeenCalledWith('/categories/1')
    );
    expect(mockedAxios.get).toHaveBeenCalledTimes(2); // Una inicial + una tras eliminar
  });

  it('opens the modal to edit a category', async () => {
    render(<Categories />);
    await waitFor(() => expect(screen.getByText('Technology')).toBeInTheDocument());

    const editButtons = screen.getAllByTestId('EditIcon').map((icon) =>
      icon.closest('button')!
    );
    fireEvent.click(editButtons[0]);

    expect(screen.getByTestId('form-dialog')).toHaveTextContent('Edit: Technology');
  });
});
