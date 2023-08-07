def multiply_3d_list_by_0_8(lst):
    # Create an empty 3D list to store the multiplied values
    result = [[[0 for _ in range(len(lst[z][y]))] for y in range(len(lst[z]))] for z in range(len(lst))]

    # Multiply each element of the original list by 0.8 and store it in the result list
    for z in range(len(lst)):
        for y in range(len(lst[z])):
            for x in range(len(lst[z][y])):
                result[z][y][x] = lst[z][y][x] * 0.6

    return result

# Example 3D list
original_3d_list = [
  [[0.0017670448167643974,0.0012458904739165544]]
]

# Multiply the 3D list by 0.8
result_3d_list = multiply_3d_list_by_0_8(original_3d_list)

# Output the result
print(result_3d_list)