package mx

fun main(args:Array<String>){
    testDual()
}

val mArraySize = 25
val mDataValue = 20

fun testDual(){
    for (i in 1..30){
        val arrSize = testGetRandomNumber(mArraySize)
        val arr = IntArray(arrSize)
        for (j in 0 until arrSize){
            arr[j]  = testGetRandomNumber(mDataValue)
        }
        val arrCheck = arr.clone()
        arrCheck.sort()
        println(arrCheck.joinToString { it.toString() } == dualQuickSort(arr, 0, arr.size - 1).joinToString { it.toString() })
    }
}

fun dualQuickSort(array:IntArray, left:Int, right:Int):IntArray{
    var i = left
    var lt = left
    var gt = right

    if(array[left] > array[right])
        swap(array, left, right)

    var pivotL = array[left]
    var pivotR = array[right]


    while(i <= gt){
        when {
            array[i] < pivotL -> swap(array, i++, lt++)
            array[i] > pivotR -> swap(array, i, gt--)
            else -> i++
        }
    }

    while(lt == left)
        lt++
    while(gt == right)
        gt--

    if(lt - 1  > left)
        dualQuickSort(array, left, lt - 1)
    if(gt  > lt)
        dualQuickSort(array, lt, gt)
    if(right > gt + 1)
        dualQuickSort(array, gt + 1, right)

    return array


}
