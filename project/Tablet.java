package project;
public class Tablet {
    public final int[] threadColors;

    public Tablet(int[] threadColors) {
        this.threadColors = threadColors;
    }

    public int getThreadCount() {
        return threadColors.length;
    }
}