package mx

class BubbleSort{

    companion object {

        @JvmStatic
        fun main(arg:Array<String>){
            println(BubbleSort().bubble(intArrayOf(2,3,4,6,20,7,10,4,8)).joinToString { it.toString() })
        }

    }

    fun bubble(input:IntArray):IntArray{
        for (i:Int in 0 until input.size){
            for (j in i + 1 until input.size) {
                if(input[j] < input[i])
                    swap(input, i, j)
            }
        }
        return input
    }


    private fun swap(arr:IntArray, i:Int, j:Int){
        val temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }


}
