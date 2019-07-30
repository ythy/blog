package mx

fun main(args:Array<String>){
    test()
}

val maxArraySize = 25
val maxDataValue = 40

fun test(){
    for (i in 1..100){
        val arrSize = testGetRandomNumber(maxArraySize)
        val arr = IntArray(arrSize)
        for (j in 0 until arrSize){
            arr[j]  = testGetRandomNumber(maxDataValue)
        }
        val arrCheck = arr.clone()
        arrCheck.sort()
        println(arrCheck.joinToString { it.toString() } == quickSort(arr, 0, arr.size - 1).joinToString { it.toString() })
    }
}

fun testGetRandomNumber(max:Int):Int{
    return ( Math.random() * 1000 % max ).toInt() + 1
}

fun quickSort(array:IntArray, left:Int, right:Int):IntArray{
    var i = left
    var j = right
    var pivot = array[( left + right ) / 2]

    while(i <= j){
        while(array[i] < pivot )
            i++
        while(array[j] > pivot)
            j--

        if(i <= j){
            swap(array, i, j)
            i++
            j--
        }
    }

    if(j > left)
        quickSort(array, left, j)
    if(right > i)
        quickSort(array, i, right)
    
    return array
}


fun swap(array:IntArray, left: Int, right: Int){
    val temp = array[left]
    array[left] = array[right]
    array[right] = temp
}

