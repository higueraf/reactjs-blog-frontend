import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';

import CategoryFormDialog from "./CategoryFormDialog";
import axiosInstance from "../../../api/axios";

jest.mock("../../../api/axios");
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("CategoryFormDialog component", () => {
  const onClose = jest.fn();
  const onSaved = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders in create mode (no category)", () => {
    render(
      <CategoryFormDialog
        open={true}
        onClose={onClose}
        onSaved={onSaved}
        category={null}
      />
    );

    expect(screen.getByText("Nueva categoría")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
  });

  it("renders in edit mode (with category)", () => {
    const category = { id: "123", name: "Cultura" };
    render(
      <CategoryFormDialog
        open={true}
        onClose={onClose}
        onSaved={onSaved}
        category={category}
      />
    );

    expect(screen.getByText("Editar categoría")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Cultura");
  });

  it("creates a new category on save", async () => {
    mockedAxios.post.mockResolvedValueOnce({});

    render(
      <CategoryFormDialog
        open={true}
        onClose={onClose}
        onSaved={onSaved}
        category={null}
      />
    );

    const input = screen.getByLabelText("Nombre");
    fireEvent.change(input, { target: { value: "Tecnología" } });

    const saveButton = screen.getByText("Guardar");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/categories", {
        name: "Tecnología",
      });
      expect(onSaved).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("updates an existing category on save", async () => {
    mockedAxios.put.mockResolvedValueOnce({});
    const category = { id: "456", name: "Arte" };

    render(
      <CategoryFormDialog
        open={true}
        onClose={onClose}
        onSaved={onSaved}
        category={category}
      />
    );

    const input = screen.getByLabelText("Nombre");
    fireEvent.change(input, { target: { value: "Arte y Cultura" } });

    const saveButton = screen.getByText("Guardar");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith("/categories/456", {
        name: "Arte y Cultura",
      });
      expect(onSaved).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
